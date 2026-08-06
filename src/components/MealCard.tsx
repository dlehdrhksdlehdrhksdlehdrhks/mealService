import React, { useState } from 'react';
import { ParsedMeal, ALLERGY_MAP } from '../types/meal';
import {
  Flame,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  AlertTriangle,
  Info,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

interface MealCardProps {
  meal: ParsedMeal;
  myAllergies: number[];
  onOpenAllergyInfo: (allergyCode: number) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  myAllergies,
  onOpenAllergyInfo,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Styling theme based on meal code
  const getMealTheme = (mealCode: string) => {
    switch (mealCode) {
      case '1': // 조식 Breakfast
        return {
          bg: 'bg-amber-50/70 border-amber-200/90',
          badgeBg: 'bg-amber-500 text-white',
          headerBg: 'bg-gradient-to-r from-amber-500 to-orange-400',
          icon: <Sun className="w-5 h-5 text-white" />,
          accentText: 'text-amber-700',
        };
      case '2': // 중식 Lunch
        return {
          bg: 'bg-emerald-50/70 border-emerald-200/90',
          badgeBg: 'bg-emerald-600 text-white',
          headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-500',
          icon: <Sun className="w-5 h-5 text-white" />,
          accentText: 'text-emerald-700',
        };
      case '3': // 석식 Dinner
        return {
          bg: 'bg-indigo-50/70 border-indigo-200/90',
          badgeBg: 'bg-indigo-600 text-white',
          headerBg: 'bg-gradient-to-r from-indigo-600 to-purple-500',
          icon: <Sunset className="w-5 h-5 text-white" />,
          accentText: 'text-indigo-700',
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          headerBg: 'bg-gradient-to-r from-slate-700 to-slate-800',
          icon: <Moon className="w-5 h-5 text-white" />,
          accentText: 'text-slate-700',
        };
    }
  };

  const theme = getMealTheme(meal.mealCode);

  // Check if any dish in this meal contains user's allergies
  const warningDishes = meal.dishes.filter((dish) =>
    dish.allergies.some((a) => myAllergies.includes(a))
  );

  const handleCopyMenu = () => {
    const text = `[${meal.mealName} 급식 식단]\n` +
      meal.dishes.map((d) => `- ${d.name}`).join('\n') +
      (meal.calorie ? `\n(칼로리: ${meal.calorie})` : '');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${theme.bg}`}
    >
      {/* Header Bar */}
      <div>
        <div className={`px-5 py-3.5 ${theme.headerBg} flex items-center justify-between text-white`}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">{theme.icon}</div>
            <h2 className="text-lg font-bold tracking-wide">{meal.mealName}</h2>
          </div>

          <div className="flex items-center gap-2">
            {meal.calorie && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {meal.calorie}
              </span>
            )}

            <button
              onClick={handleCopyMenu}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="식단 텍스트 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Allergy Warning Alert if triggered */}
        {warningDishes.length > 0 && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">주의 알레르기 성분 포함: </strong>
              <span>
                {warningDishes.map((d) => d.name).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Dish List */}
        <div className="p-4 sm:p-5">
          <ul className="space-y-2.5">
            {meal.dishes.map((dish, idx) => {
              const containsMyAllergy = dish.allergies.some((a) => myAllergies.includes(a));

              return (
                <li
                  key={idx}
                  className={`p-3 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    containsMyAllergy
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950 font-medium'
                      : 'bg-white/80 border-slate-200/80 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-base leading-snug break-keep flex-1">
                    {dish.name}
                  </span>

                  {/* Allergy Pills */}
                  {dish.allergies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 shrink-0">
                      {dish.allergies.map((code) => {
                        const allergyInfo = ALLERGY_MAP[code];
                        const isMine = myAllergies.includes(code);

                        return (
                          <button
                            key={code}
                            onClick={() => onOpenAllergyInfo(code)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                              isMine
                                ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-300'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title={allergyInfo ? `${code}. ${allergyInfo.name}` : `${code}번 알레르기`}
                          >
                            <span>{allergyInfo?.icon || '⚠️'}</span>
                            <span>{code}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Origin & Nutrition Collapsible Info */}
      {(meal.originInfo.length > 0 || meal.nutritionInfo.length > 0) && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/70 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>원산지 및 영양 정보</span>
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-3">
              {meal.originInfo.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    🌾 원산지 정보
                  </h4>
                  <p className="leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {meal.originInfo.join(', ')}
                  </p>
                </div>
              )}

              {meal.nutritionInfo.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    📊 영양 성분 정보
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600">
                    {meal.nutritionInfo.map((nut, i) => (
                      <div key={i} className="py-0.5 border-b border-slate-100 last:border-0">
                        {nut}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
