import {
  NEISMealRaw,
  NEISSchoolRaw,
  ParsedMeal,
  DishItem,
  SchoolInfo,
  DEFAULT_SCHOOL,
} from '../types/meal';

const BASE_URL = 'https://open.neis.go.kr/hub';

/**
 * Parses DDISH_NM string from NEIS API into structured DishItems.
 * Example input: "차돌박이된장찌개 (5.6.10.16)<br/>돈육고추장불고기 (5.6.10)"
 */
export function parseDishes(rawDishText: string): DishItem[] {
  if (!rawDishText) return [];

  const rawLines = rawDishText.split(/<br\s*\/?>/i);

  return rawLines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Extract allergy numbers enclosed in parentheses, e.g., (1.2.5.6.10) or (1.2.5) or 1.2.5 at end
      const allergyMatch = line.match(/\(([\d.\s,]+)\)/) || line.match(/([\d.\s,]+)$/);

      let name = line;
      const allergies: number[] = [];

      if (allergyMatch) {
        // Remove allergy notation from dish name
        name = line.replace(/\(([\d.\s,]+)\)/, '').trim();

        // Extract numbers from matched group
        const numbersStr = allergyMatch[1];
        const extracted = numbersStr
          .split(/[.,\s]+/)
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n) && n >= 1 && n <= 19);

        // Remove duplicates & sort
        allergies.push(...Array.from(new Set(extracted)).sort((a, b) => a - b));
      }

      // Clean up any remaining trailing punctuation
      name = name.replace(/\.$/, '').trim();

      return {
        raw: line,
        name,
        allergies,
      };
    });
}

/**
 * Parse origin info string (ORGC_INFO) into array of items.
 * Example input: "쌀 : 국내산<br/>배추김치 : 배추(국내산), 고춧가루(국내산)<br/>쇠고기 : 국내산"
 */
export function parseOriginInfo(rawOriginText?: string): string[] {
  if (!rawOriginText) return [];
  return rawOriginText
    .split(/<br\s*\/?>/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse nutrient info string (NTR_INFO) into array of items.
 * Example input: "탄수화물(g) : 120.5<br/>단백질(g) : 35.2<br/>지방(g) : 15.0"
 */
export function parseNutritionInfo(rawNutrientText?: string): string[] {
  if (!rawNutrientText) return [];
  return rawNutrientText
    .split(/<br\s*\/?>/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Fetch Meal Diet Info from NEIS API
 * @param officeCode ATPT_OFCDC_SC_CODE (e.g., C10)
 * @param schoolCode SD_SCHUL_CODE (e.g., 7150152)
 * @param dateOrMonth MLSV_YMD (YYYYMMDD or YYYYMM)
 */
export async function fetchMealDietInfo(
  officeCode: string,
  schoolCode: string,
  dateOrMonth: string
): Promise<ParsedMeal[]> {
  const url = `${BASE_URL}/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${encodeURIComponent(
    officeCode
  )}&SD_SCHUL_CODE=${encodeURIComponent(
    schoolCode
  )}&MLSV_YMD=${encodeURIComponent(dateOrMonth)}&type=json&pSize=100`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`NEIS API HTTP 오류: ${res.status}`);
    }

    const data = await res.json();

    if (data.RESULT) {
      if (data.RESULT.CODE === 'INFO-200') {
        // No meal info found for this date/month
        return [];
      }
      throw new Error(data.RESULT.MESSAGE || '급식 정보 조회 실패');
    }

    if (!data.mealServiceDietInfo) {
      return [];
    }

    const rows: NEISMealRaw[] = data.mealServiceDietInfo[1]?.row || [];

    return rows.map((row) => ({
      mealCode: row.MMEAL_SC_CODE,
      mealName: row.MMEAL_SC_NM,
      date: row.MLSV_YMD,
      dishes: parseDishes(row.DDISH_NM),
      calorie: row.CAL_INFO || '',
      originInfo: parseOriginInfo(row.ORGC_INFO),
      nutritionInfo: parseNutritionInfo(row.NTR_INFO),
    }));
  } catch (err: any) {
    console.error('fetchMealDietInfo error:', err);
    throw err;
  }
}

/**
 * Search Schools via NEIS schoolInfo API
 */
export async function searchSchools(query: string): Promise<SchoolInfo[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${BASE_URL}/schoolInfo?SCHUL_NM=${encodeURIComponent(
    query.trim()
  )}&type=json&pSize=30`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`학교 검색 HTTP 오류: ${res.status}`);
    }

    const data = await res.json();

    if (!data.schoolInfo) {
      return [];
    }

    const rows: NEISSchoolRaw[] = data.schoolInfo[1]?.row || [];

    return rows.map((row) => ({
      officeCode: row.ATPT_OFCDC_SC_CODE,
      officeName: row.ATPT_OFCDC_SC_NM,
      schoolCode: row.SD_SCHUL_CODE,
      schoolName: row.SCHUL_NM,
      address: row.ORG_RDNMA || '',
      kind: row.SCHUL_KND_SC_NM || '',
    }));
  } catch (err) {
    console.error('searchSchools error:', err);
    return [];
  }
}

/**
 * Sample fallback data generator for offline / test demonstration if NEIS API fails or date has no meal
 */
export function getSampleMealData(dateStr: string, schoolName: string): ParsedMeal[] {
  return [
    {
      mealCode: '1',
      mealName: '조식',
      date: dateStr,
      dishes: [
        { raw: '쌀밥', name: '쌀밥', allergies: [] },
        { raw: '콩나물국 (5.6)', name: '콩나물국', allergies: [5, 6] },
        { raw: '계란말이 (1.5)', name: '계란말이', allergies: [1, 5] },
        { raw: '배추김치 (9.13)', name: '배추김치', allergies: [9, 13] },
        { raw: '우유 (2)', name: '우유', allergies: [2] },
      ],
      calorie: '520.4 kcal',
      originInfo: ['쌀: 국내산', '계란: 국내산', '배추김치: 국내산'],
      nutritionInfo: ['탄수화물(g) : 85.0', '단백질(g) : 22.0', '지방(g) : 12.0'],
    },
    {
      mealCode: '2',
      mealName: '중식',
      date: dateStr,
      dishes: [
        { raw: '현미밥', name: '현미밥', allergies: [] },
        { raw: '차돌박이된장찌개 (5.6.10.16)', name: '차돌박이된장찌개', allergies: [5, 6, 10, 16] },
        { raw: '돈육고추장불고기 (5.6.10)', name: '돈육고추장불고기', allergies: [5, 6, 10] },
        { raw: '상추쌈 / 쌈장 (5.6)', name: '상추쌈 / 쌈장', allergies: [5, 6] },
        { raw: '깍두기 (9.13)', name: '깍두기', allergies: [9, 13] },
        { raw: '청포도', name: '청포도', allergies: [] },
      ],
      calorie: '845.2 kcal',
      originInfo: ['쌀: 국내산', '돼지고기: 국내산', '쇠고기(차돌박이): 국내산', '배추김치: 국내산'],
      nutritionInfo: ['탄수화물(g) : 124.5', '단백질(g) : 38.4', '지방(g) : 21.0'],
    },
    {
      mealCode: '3',
      mealName: '석식',
      date: dateStr,
      dishes: [
        { raw: '치킨마요덮밥 (1.5.6.15)', name: '치킨마요덮밥', allergies: [1, 5, 6, 15] },
        { raw: '유부장국 (5.6)', name: '유부장국', allergies: [5, 6] },
        { raw: '단무지무침', name: '단무지무침', allergies: [] },
        { raw: '배추김치 (9.13)', name: '배추김치', allergies: [9, 13] },
        { raw: '요구르트 (2)', name: '요구르트', allergies: [2] },
      ],
      calorie: '760.1 kcal',
      originInfo: ['닭고기: 국내산', '배추김치: 국내산'],
      nutritionInfo: ['탄수화물(g) : 110.0', '단백질(g) : 30.5', '지방(g) : 18.2'],
    },
  ];
}
