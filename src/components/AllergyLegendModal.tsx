import React from 'react';
import { ALLERGY_MAP } from '../types/meal';
import { ShieldAlert, Check, X, Info } from 'lucide-react';

interface AllergyLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  myAllergies: number[];
  onToggleAllergy: (code: number) => void;
  onClearAllergies: () => void;
  highlightCode?: number | null;
}

export const AllergyLegendModal: React.FC<AllergyLegendModalProps> = ({
  isOpen,
  onClose,
  myAllergies,
  onToggleAllergy,
  onClearAllergies,
  highlightCode,
}) => {
  if (!isOpen) return null;

  const allergyCodes = Object.keys(ALLERGY_MAP).map(Number);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold">NEIS 알레르기 유발물질 (19종)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description Banner */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>본인이 주의해야 할 알레르기를 클릭하여 선택하면 식단에서 빨간색으로 강조 표시됩니다.</span>
          </p>

          {myAllergies.length > 0 && (
            <button
              onClick={onClearAllergies}
              className="text-xs font-semibold text-rose-600 hover:underline shrink-0"
            >
              선택 초기화 ({myAllergies.length}개 선택됨)
            </button>
          )}
        </div>

        {/* Allergy Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {allergyCodes.map((code) => {
              const item = ALLERGY_MAP[code];
              const isSelected = myAllergies.includes(code);
              const isHighlighted = highlightCode === code;

              return (
                <button
                  key={code}
                  onClick={() => onToggleAllergy(code)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs font-bold'
                      : isHighlighted
                      ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">{item.icon}</span>
                    <div className="truncate">
                      <span className="text-xs opacity-80 block">{code}번</span>
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
