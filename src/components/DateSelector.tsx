import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  onSelectToday: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onChangeDate,
  onSelectToday,
}) => {
  // Format Date to YYYY-MM-DD for <input type="date">
  const formatInputDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Format Date display e.g. "2026년 7월 1일 (수)"
  const formatDisplayDate = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const dayOfWeek = days[date.getDay()];

    return `${y}년 ${m}월 ${d}일 (${dayOfWeek})`;
  };

  const handlePrevDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    onChangeDate(next);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onChangeDate(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-').map(Number);
    if (year && month && day) {
      onChangeDate(new Date(year, month - 1, day));
    }
  };

  const isToday = (date: Date): boolean => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Main Date Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePrevDay}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="이전날 식단 보기"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Date Picker Display */}
          <div className="relative group cursor-pointer flex-1 sm:flex-none">
            <input
              type="date"
              value={formatInputDate(selectedDate)}
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50/50 transition-all text-slate-900 font-bold text-base sm:text-lg min-h-[44px]">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
              <span>{formatDisplayDate(selectedDate)}</span>
            </div>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="다음날 식단 보기"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onSelectToday}
            disabled={isToday(selectedDate)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
              isToday(selectedDate)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>오늘 급식</span>
          </button>
        </div>
      </div>
    </div>
  );
};
