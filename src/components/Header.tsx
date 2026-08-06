import React from 'react';
import { SchoolInfo } from '../types/meal';
import { Utensils, Search, Calendar, Grid, AlertCircle, Bookmark, Sparkles, Home } from 'lucide-react';

interface HeaderProps {
  currentSchool: SchoolInfo;
  onOpenSearch: () => void;
  activeTab: 'daily' | 'monthly' | 'allergy';
  setActiveTab: (tab: 'daily' | 'monthly' | 'allergy') => void;
  myAllergiesCount: number;
  onOpenAllergyModal: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  onOpenSearch,
  activeTab,
  setActiveTab,
  myAllergiesCount,
  onOpenAllergyModal,
  favoritesCount,
  onOpenFavorites,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Main Title */}
          <div className="flex items-center justify-between">
            <a
              href="https://dlehdrhksdlehdrhksdlehdrhks.github.io/AI2026/index.html"
              className="flex items-center gap-3 group hover:opacity-95 transition-opacity"
              title="홈으로 이동"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Utensils className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  학교 급식 다이어리
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    NEIS
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  전국 초·중·고등학교 날짜별 실시간 급식 식단 정보
                </p>
              </div>
            </a>

            {/* Mobile Home / Favorite / Search Shortcuts */}
            <div className="flex items-center gap-1.5 md:hidden">
              <a
                href="https://dlehdrhksdlehdrhksdlehdrhks.github.io/AI2026/index.html"
                className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 bg-emerald-50/60 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="홈으로 이동"
              >
                <Home className="w-4 h-4" />
                <span>홈</span>
              </a>
              <button
                onClick={onOpenFavorites}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative"
                title="즐겨찾기 학교"
              >
                <Bookmark className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 bg-emerald-50/50 transition-colors"
                title="학교 검색"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* School Selector Button & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
            {/* Dedicated Home Link Button */}
            <a
              href="https://dlehdrhksdlehdrhksdlehdrhks.github.io/AI2026/index.html"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 transition-colors shadow-xs"
              title="홈페이지로 이동"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">홈</span>
            </a>

            {/* Active School Badge */}
            <button
              onClick={onOpenSearch}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-800 transition-all text-sm font-medium shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              <span className="font-semibold text-slate-900 max-w-[180px] sm:max-w-[240px] truncate">
                {currentSchool.schoolName}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                ({currentSchool.officeName.replace('교육청', '')})
              </span>
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors ml-1" />
            </button>

            {/* Favorite button (Desktop) */}
            <button
              onClick={onOpenFavorites}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="즐겨찾는 학교 관리"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>즐겨찾기</span>
              {favoritesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Allergy Filter Button */}
            <button
              onClick={onOpenAllergyModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                myAllergiesCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${myAllergiesCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>알레르기</span>
              {myAllergiesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-white">
                  {myAllergiesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-200/80 mt-3 pt-2">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'daily'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>일별 식단</span>
            </button>

            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>월별 달력</span>
            </button>

            <button
              onClick={() => setActiveTab('allergy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'allergy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>알레르기 안내</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
