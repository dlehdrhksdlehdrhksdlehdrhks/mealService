import React from 'react';
import { SchoolInfo, DEFAULT_SCHOOL } from '../types/meal';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SchoolInfo[];
  onSelectSchool: (school: SchoolInfo) => void;
  onRemoveFavorite: (schoolCode: string) => void;
  currentSchoolCode: string;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectSchool,
  onRemoveFavorite,
  currentSchoolCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">즐겨찾는 학교</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-5 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Always option to switch to Default School */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 block">기본 추천 학교</span>
                <span className="font-bold text-slate-900 text-sm">
                  {DEFAULT_SCHOOL.schoolName}
                </span>
              </div>
              <button
                onClick={() => {
                  onSelectSchool(DEFAULT_SCHOOL);
                  onClose();
                }}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>선택</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {favorites.length > 0 ? (
              favorites.map((school) => {
                const isCurrent = school.schoolCode === currentSchoolCode;
                return (
                  <div
                    key={school.schoolCode}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectSchool(school);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <h4 className="font-bold text-slate-900 text-sm">{school.schoolName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{school.officeName}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onSelectSchool(school);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isCurrent ? '현재 선택됨' : '선택'}
                      </button>

                      <button
                        onClick={() => onRemoveFavorite(school.schoolCode)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="즐겨찾기 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">등록된 즐겨찾기가 없습니다.</p>
                <p className="text-xs mt-1">학교 검색 창에서 별표/북마크를 눌러 저장해 보세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
