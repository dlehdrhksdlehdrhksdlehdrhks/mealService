export interface NEISMealRaw {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명
  SD_SCHUL_CODE: string;      // 표준학교코드
  SCHUL_NM: string;           // 학교명
  MMEAL_SC_CODE: string;      // 식사코드 (1: 조식, 2: 중식, 3: 석식)
  MMEAL_SC_NM: string;        // 식사명
  MLSV_YMD: string;           // 급식일자 (YYYYMMDD)
  MLSV_FND_YMD?: string;      // 급식제공일자
  DDISH_NM: string;           // 요리명 (<br/>로 구분, 알레르기 번호 포함)
  ORGC_INFO?: string;         // 원산지정보
  CAL_INFO?: string;          // 칼로리정보
  NTR_INFO?: string;          // 영양정보
}

export interface NEISSchoolRaw {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ENG_SCHUL_NM?: string;
  SCHUL_KND_SC_NM?: string;
  LCTN_SC_NM?: string;
  JU_ORG_NM?: string;
  ORG_RDNMA?: string;
}

export interface SchoolInfo {
  officeCode: string;
  officeName: string;
  schoolCode: string;
  schoolName: string;
  address?: string;
  kind?: string;
}

export interface DishItem {
  raw: string;
  name: string;
  allergies: number[];
}

export interface ParsedMeal {
  mealCode: string; // "1", "2", "3"
  mealName: string; // "조식", "중식", "석식"
  date: string;     // YYYYMMDD
  dishes: DishItem[];
  calorie: string;
  originInfo: string[];
  nutritionInfo: string[];
}

export const ALLERGY_MAP: Record<number, { name: string; icon: string }> = {
  1: { name: '난류', icon: '🥚' },
  2: { name: '우유', icon: '🥛' },
  3: { name: '메밀', icon: '🌾' },
  4: { name: '땅콩', icon: '🥜' },
  5: { name: '대두', icon: '🫘' },
  6: { name: '밀', icon: '🌾' },
  7: { name: '고등어', icon: '🐟' },
  8: { name: '게', icon: '🦀' },
  9: { name: '새우', icon: '🦐' },
  10: { name: '돼지고기', icon: '🐖' },
  11: { name: '복숭아', icon: '🍑' },
  12: { name: '토마토', icon: '🍅' },
  13: { name: '아황산류', icon: '🍷' },
  14: { name: '호두', icon: '🌰' },
  15: { name: '닭고기', icon: '🐓' },
  16: { name: '쇠고기', icon: '🐄' },
  17: { name: '오징어', icon: '🦑' },
  18: { name: '조개류(굴/전복/홍합 포함)', icon: '🦪' },
  19: { name: '잣', icon: '🌲' },
};

export const DEFAULT_SCHOOL: SchoolInfo = {
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150152',
  schoolName: '양정고등학교',
  address: '부산광역시 부산진구 양정동 345-1',
  kind: '고등학교',
};
