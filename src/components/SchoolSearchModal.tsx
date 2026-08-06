import React, { useState, useEffect } from 'react';
import { SchoolInfo, DEFAULT_SCHOOL } from '../types/meal';
import { searchSchools } from '../services/neisApi';
import { Search, X, MapPin, Building2, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
  favorites: SchoolInfo[];
  onToggleFavorite: (school: SchoolInfo) => void;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSchool,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchSchools(query);
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const isFav = (schoolCode: string) => {
    return favorites.some((f) => f.schoolCode === schoolCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">전국 학교 검색</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="학교명을 입력하세요 (예: 부산소프트웨어마이스터고, 서울고)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-600">
            <span className="font-semibold shrink-0 text-slate-500">기본 설정:</span>
            <button
              onClick={() => {
                onSelectSchool(DEFAULT_SCHOOL);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 shrink-0 transition-colors"
            >
              {DEFAULT_SCHOOL.schoolName}
            </button>
          </div>
        </div>

        {/* Results List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm">학교 정보를 검색 중입니다...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 px-1">
                검색 결과 ({results.length}건)
              </div>
              {results.map((school) => {
                const isFavorite = isFav(school.schoolCode);
                return (
                  <div
                    key={school.schoolCode}
                    className="group p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => {
                        onSelectSchool(school);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base group-hover:text-emerald-700">
                          {school.schoolName}
                        </span>
                        {school.kind && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                            {school.kind}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{school.officeName}</span>
                        {school.address && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 truncate max-w-[280px]">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {school.address}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(school)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                      title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    >
                      {isFavorite ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <p className="font-semibold text-slate-700">검색 결과가 없습니다.</p>
              <p className="text-xs mt-1">학교명을 정확하게 입력하셨는지 확인해 주세요.</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="py-8 text-center text-slate-500">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">원하는 학교를 검색해 보세요</p>
              <p className="text-xs mt-1 text-slate-400">
                초등학교, 중학교, 고등학교 명칭으로 검색할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
