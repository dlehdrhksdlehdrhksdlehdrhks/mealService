import React, { useState, useEffect } from 'react';
import { SchoolInfo, ParsedMeal } from '../types/meal';
import { fetchMealDietInfo, getSampleMealData } from '../services/neisApi';
import { ChevronLeft, ChevronRight, Loader2, Utensils, Calendar as CalendarIcon } from 'lucide-react';

interface MonthlyCalendarViewProps {
  currentSchool: SchoolInfo;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  myAllergies: number[];
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  currentSchool,
  currentDate,
  onSelectDate,
  myAllergies,
}) => {
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1); // 1-indexed
  const [mealsMap, setMealsMap] = useState<Record<string, ParsedMeal[]>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setViewYear(currentDate.getFullYear());
    setViewMonth(currentDate.getMonth() + 1);
  }, [currentDate]);

  useEffect(() => {
    loadMonthlyMeals();
  }, [currentSchool, viewYear, viewMonth]);

  const loadMonthlyMeals = async () => {
    setLoading(true);
    setErrorMsg(null);

    const monthStr = `${viewYear}${String(viewMonth).padStart(2, '0')}`;

    try {
      const meals = await fetchMealDietInfo(
        currentSchool.officeCode,
        currentSchool.schoolCode,
        monthStr
      );

      // Group meals by MLSV_YMD string (YYYYMMDD)
      const map: Record<string, ParsedMeal[]> = {};
      meals.forEach((m) => {
        if (!map[m.date]) {
          map[m.date] = [];
        }
        map[m.date].push(m);
      });

      setMealsMap(map);
    } catch (err: any) {
      console.warn('Monthly meal fetch failed, using fallback mock if needed', err);
      setErrorMsg('NEIS 서버 응답 지연으로 일부 데이터가 제한될 수 있습니다.');

      // Fallback for demonstration for selected month
      const map: Record<string, ParsedMeal[]> = {};
      const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${viewYear}${String(viewMonth).padStart(2, '0')}${String(d).padStart(2, '0')}`;
        // Add sample meal for weekdays
        const dayOfWeek = new Date(viewYear, viewMonth - 1, d).getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          map[dateStr] = getSampleMealData(dateStr, currentSchool.schoolName);
        }
      }
      setMealsMap(map);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate calendar grid array
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0 = Sun
  const totalDays = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];
  // Leading empty padding days
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of the month
  for (let d = 1; d <= totalDays; d++) {
    calendarDays.push(d);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() + 1 === viewMonth &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    return (
      currentDate.getFullYear() === viewYear &&
      currentDate.getMonth() + 1 === viewMonth &&
      currentDate.getDate() === day
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {viewYear}년 {viewMonth}월 급식 달력
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            title="이전달"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <span className="text-sm font-semibold text-slate-700 min-w-[70px] text-center">
            {viewMonth}월
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            title="다음달"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          {errorMsg}
        </div>
      )}

      {/* Loading Overlay */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm">월별 식단 정보를 불러오는 중...</p>
        </div>
      ) : (
        /* Calendar Grid */
        <div className="space-y-2">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold py-2 border-b border-slate-100">
            <span className="text-rose-600">일</span>
            <span className="text-slate-700">월</span>
            <span className="text-slate-700">화</span>
            <span className="text-slate-700">수</span>
            <span className="text-slate-700">목</span>
            <span className="text-slate-700">금</span>
            <span className="text-blue-600">토</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-24 sm:h-28 rounded-xl bg-slate-50/50 border border-transparent"
                  />
                );
              }

              const dateKey = `${viewYear}${String(viewMonth).padStart(2, '0')}${String(
                day
              ).padStart(2, '0')}`;
              const dayMeals = mealsMap[dateKey] || [];
              const dayOfWeek = new Date(viewYear, viewMonth - 1, day).getDay();

              const lunchMeal = dayMeals.find((m) => m.mealCode === '2');
              const mainDish = lunchMeal?.dishes[0]?.name || dayMeals[0]?.dishes[0]?.name;

              return (
                <div
                  key={day}
                  onClick={() => onSelectDate(new Date(viewYear, viewMonth - 1, day))}
                  className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                    isSelected(day)
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30 font-bold'
                      : isToday(day)
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top Bar (Day number & Badges) */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold rounded-md px-1.5 py-0.5 ${
                        isToday(day)
                          ? 'bg-emerald-600 text-white'
                          : dayOfWeek === 0
                          ? 'text-rose-600'
                          : dayOfWeek === 6
                          ? 'text-blue-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Meal counts */}
                    {dayMeals.length > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {dayMeals.length}식
                      </span>
                    )}
                  </div>

                  {/* Meal Preview Content */}
                  {dayMeals.length > 0 ? (
                    <div className="space-y-1 my-auto">
                      <p className="text-[11px] sm:text-xs text-slate-900 font-semibold line-clamp-2 leading-tight group-hover:text-emerald-700">
                        {mainDish}
                      </p>
                      <div className="flex flex-wrap gap-0.5">
                        {dayMeals.map((m) => (
                          <span
                            key={m.mealCode}
                            className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                              m.mealCode === '1'
                                ? 'bg-amber-100 text-amber-800'
                                : m.mealCode === '2'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {m.mealName[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="my-auto text-center">
                      <span className="text-[10px] text-slate-300">급식 없음</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
