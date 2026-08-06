# 🏫 학교 급식 다이어리 (NEIS 식단 조회 서비스) PRD

## 1. 개요 (Overview)
**학교 급식 다이어리**는 교육부 나이스(NEIS) 오픈 API와 실시간 연동하여 전국 초·중·고등학교 및 특수학교의 **일별/월별 급식 식단, 영양 정보, 원산지 정보, 알레르기 유발 성분**을 간편하게 조회하고 관리할 수 있는 웹 서비스입니다.

학생, 학부모, 교직원이 매일의 급식을 빠르게 확인하고, 개인별 알레르기 항목을 등록하여 경고 알림을 받는 등의 개인화 기능을 제공합니다.

---

## 2. 주요 기능 및 요구사항 (Key Features)

### 2.1 실시간 급식 식단 조회 (일별 식단)
- **날짜 선택**: 오늘 날짜, 날짜 이동(전일/다음날/특정 날짜 지정)을 통해 실시간 급식 식단 조회.
- **구분별 식단 카드**: 조식(아침), 중식(점심), 석식(저녁) 카드로 시각적 구분 제공.
- **카드 넓이 및 가독성 최적화**: 
  - 메뉴명 한글 단어 단위 줄바꿈 (`break-keep`) 적용으로 어색한 단어 잘림 방지.
  - 급식 제공 개수(1~3개)에 따른 반응형 넓이 조정 및 충분한 수평 공간 확보.
- **칼로리 및 복사 기능**: 식단별 총 칼로리 표시 및 공유용 텍스트 복사 기능 제공.
- **원산지 & 영양 성분**: 접이식(Accordion) 메뉴를 통해 상세 원산지 및 영양 성분 확인.

### 2.2 학교 검색 및 즐겨찾기 (School Search & Favorites)
- **전국 학교 검색**: 교육청/학교명 키워드 검색 (NEIS `schoolInfo` API 연동).
- **최근 검색 & 즐겨찾기**: 자주 찾는 학교(예: 양정고등학교 등)를 즐겨찾기로 등록하여 빠른 전환 지원 (`localStorage` 저장).

### 2.3 개인 맞춤 알레르기 필터링 & 가이드 (Allergy Monitoring)
- **1~19번 식약처 기준 알레르기 정보**:
  1. 난류, 2. 우유, 3. 메밀, 4. 땅콩, 5. 대두, 6. 밀, 7. 게, 8. 새우, 9. 돼지고기, 10. 복숭아, 11. 토마토, 12. 아황산류, 13. 호두, 14. 닭고기, 15. 쇠고기, 16. 오징어, 17. 조개류, 18. 잣, 19. 새우/기타
- **내 알레르기 맞춤 설정**: 사용자 본인의 알레르기 항목을 선택 시, 해당 성분이 포함된 식단 메뉴에 붉은색 경고 배지 및 하이라이트 제공.
- **알레르기 가이드 탭/모달**: 각 번호별 원재료 및 주의사항 모달 정보 제공.

### 2.4 월별 급식 달력 (Monthly Calendar View)
- 월 단위 급식 제공 현황 한눈에 보기.
- 해당 월의 날짜별 점심/저녁 주요 메뉴 요약 및 알레르기 위험 표시.
- 날짜 클릭 시 해당 일자의 상세 일별 식단 뷰로 즉시 이동.

---

## 3. 화면 구성 및 UX 디자인 (UI/UX Guidelines)

- **디자인 컨셉**: Clean & Friendly School Lunch Dashboard
- **메인 컬러 시스템**:
  - 조식 (Breakfast): Amber/Orange 계열 (`#f59e0b`)
  - 중식 (Lunch): Emerald/Teal 계열 (`#059669`)
  - 석식 (Dinner): Indigo/Purple 계열 (`#4f46e5`)
  - 경고 (Warning): Rose/Red 계열 (`#f43f5e`)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 전 규격 지원 (최대 1280px `max-w-7xl` 중앙 배치).

---

## 4. 데이터 아키텍처 & API 연동 (Data Architecture)

### 4.1 NEIS Open API 연동 명세
1. **학교 정보 검색 API**
   - EndPoint: `https://open.neis.go.kr/hub/schoolInfo`
   - Params: `KEY`, `Type=json`, `SCHUL_NM`
2. **급식 식단 정보 API**
   - EndPoint: `https://open.neis.go.kr/hub/mealServiceDietInfo`
   - Params: `KEY`, `Type=json`, `ATPT_OFCDC_SC_CODE`, `SD_SCHUL_CODE`, `MLSV_YMD` (또는 `MLSV_FROM_YMD` & `MLSV_TO_YMD`)

### 4.2 로컬 스토리지 (Local Storage Schema)
- `neis_current_school`: 현재 선택된 학교 정보 (`SchoolInfo`)
- `neis_favorite_schools`: 즐겨찾기 학교 목록 (`SchoolInfo[]`)
- `neis_my_allergies`: 사용자가 선택한 알레르기 코드 배열 (`number[]`)

---

## 5. 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP/API**: Fetch API with CORS Fallbacks & Sample Data Handling

---

## 6. 버전에 따른 주요 변경 이력 (Changelog)

- **v1.0.0**: 
  - 기본 학교 검색, 일별/월별 급식 조회 및 알레르기 연동 구현.
  - 기본 학교 설정 수정 (부산 양정고등학교: `C10`, `7150152`).
- **v1.1.0**:
  - 급식 카드 가로 넓이 확장 및 layout 최적화 (`max-w-7xl`, 1~3개 식단 카드 그리드 가변 레이아웃).
  - 메뉴명 한국어 단어 미자름 처리 (`break-keep`) 적용.
  - `prd.md` 문서 작성.
