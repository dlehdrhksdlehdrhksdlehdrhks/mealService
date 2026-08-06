import React, { useState, useEffect } from 'react';
import { SchoolInfo, ParsedMeal, DEFAULT_SCHOOL } from './types/meal';
import { fetchMealDietInfo, getSampleMealData } from './services/neisApi';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { MealCard } from './components/MealCard';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { AllergyGuideView } from './components/AllergyGuideView';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { AllergyLegendModal } from './components/AllergyLegendModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { Footer } from './components/Footer';
import { Loader2, CalendarX, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

export default function App() {
  // Current School State (stored in localStorage)
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem('neis_current_school');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SCHOOL;
  });

  // Selected Date State
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'allergy'>('daily');

  // Meal Data State
  const [meals, setMeals] = useState<ParsedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Allergies State (stored in localStorage)
  const [myAllergies, setMyAllergies] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('neis_my_allergies');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Favorites State (stored in localStorage)
  const [favorites, setFavorites] = useState<SchoolInfo[]>(() => {
    try {
      const saved = localStorage.getItem('neis_favorite_schools');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [DEFAULT_SCHOOL];
  });

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [highlightedAllergyCode, setHighlightedAllergyCode] = useState<number | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('neis_current_school', JSON.stringify(currentSchool));
  }, [currentSchool]);

  useEffect(() => {
    localStorage.setItem('neis_my_allergies', JSON.stringify(myAllergies));
  }, [myAllergies]);

  useEffect(() => {
    localStorage.setItem('neis_favorite_schools', JSON.stringify(favorites));
  }, [favorites]);

  // Load Daily Meals
  useEffect(() => {
    if (activeTab === 'daily') {
      loadDailyMeals();
    }
  }, [currentSchool, selectedDate, activeTab]);

  const loadDailyMeals = async () => {
    setLoading(true);
    setErrorMsg(null);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    try {
      const fetchedMeals = await fetchMealDietInfo(
        currentSchool.officeCode,
        currentSchool.schoolCode,
        dateStr
      );

      setMeals(fetchedMeals);
    } catch (err: any) {
      console.warn('Daily meal fetch error:', err);
      setErrorMsg('NEIS 실시간 데이터 연결 문제로 샘플 데이터를 표시합니다.');
      // Fallback sample data if network fails
      setMeals(getSampleMealData(dateStr, currentSchool.schoolName));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (school: SchoolInfo) => {
    setCurrentSchool(school);
  };

  const handleToggleFavorite = (school: SchoolInfo) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.schoolCode === school.schoolCode);
      if (exists) {
        return prev.filter((f) => f.schoolCode !== school.schoolCode);
      }
      return [...prev, school];
    });
  };

  const handleRemoveFavorite = (schoolCode: string) => {
    setFavorites((prev) => prev.filter((f) => f.schoolCode !== schoolCode));
  };

  const handleToggleAllergy = (code: number) => {
    setMyAllergies((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleClearAllergies = () => {
    setMyAllergies([]);
  };

  const handleOpenAllergyInfo = (code: number) => {
    setHighlightedAllergyCode(code);
    setIsAllergyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        currentSchool={currentSchool}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myAllergiesCount={myAllergies.length}
        onOpenAllergyModal={() => {
          setHighlightedAllergyCode(null);
          setIsAllergyModalOpen(true);
        }}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Daily View Tab */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {/* Date Selector */}
            <DateSelector
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              onSelectToday={() => setSelectedDate(new Date())}
            />

            {/* Error / Notice banner if any */}
            {errorMsg && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-800 flex items-center justify-between">
                <span>{errorMsg}</span>
                <button
                  onClick={loadDailyMeals}
                  className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 font-semibold text-amber-900 text-xs flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>재시도</span>
                </button>
              </div>
            )}

            {/* Meal Cards Display */}
            {loading ? (
              <div className="py-24 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 shadow-xs">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
                <p className="font-semibold text-slate-700">급식 식단 정보를 가져오는 중입니다...</p>
                <p className="text-xs text-slate-400 mt-1">나이스(NEIS) 오픈 API 실시간 조회</p>
              </div>
            ) : meals.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  meals.length === 1
                    ? 'grid-cols-1 max-w-2xl mx-auto'
                    : meals.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}
              >
                {meals.map((meal) => (
                  <MealCard
                    key={`${meal.date}-${meal.mealCode}`}
                    meal={meal}
                    myAllergies={myAllergies}
                    onOpenAllergyInfo={handleOpenAllergyInfo}
                  />
                ))}
              </div>
            ) : (
              /* Empty State when no meal found on chosen date */
              <div className="py-16 px-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <CalendarX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    등록된 급식 정보가 없습니다
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    주말, 공휴일, 방학 기간 또는 식단 미등록 날짜일 수 있습니다.
                    월별 달력 탭에서 급식 제공일을 한눈에 확인해 보세요.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('monthly')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>월별 급식 달력 확인하기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monthly View Tab */}
        {activeTab === 'monthly' && (
          <MonthlyCalendarView
            currentSchool={currentSchool}
            currentDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setActiveTab('daily');
            }}
            myAllergies={myAllergies}
          />
        )}

        {/* Allergy Guide View Tab */}
        {activeTab === 'allergy' && (
          <AllergyGuideView
            myAllergies={myAllergies}
            onToggleAllergy={handleToggleAllergy}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <SchoolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSchool={handleSelectSchool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <AllergyLegendModal
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        myAllergies={myAllergies}
        onToggleAllergy={handleToggleAllergy}
        onClearAllergies={handleClearAllergies}
        highlightCode={highlightedAllergyCode}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectSchool={handleSelectSchool}
        onRemoveFavorite={handleRemoveFavorite}
        currentSchoolCode={currentSchool.schoolCode}
      />
    </div>
  );
}
