import React from 'react';
import { ALLERGY_MAP } from '../types/meal';
import { ShieldCheck, Info, HeartHandshake } from 'lucide-react';

interface AllergyGuideViewProps {
  myAllergies: number[];
  onToggleAllergy: (code: number) => void;
}

export const AllergyGuideView: React.FC<AllergyGuideViewProps> = ({
  myAllergies,
  onToggleAllergy,
}) => {
  const codes = Object.keys(ALLERGY_MAP).map(Number);

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">학교 급식 알레르기 유발물질 안내</h2>
            <p className="text-emerald-100 text-sm mt-1 leading-relaxed">
              교육부 식단 가이드라인에 따른 19가지 알레르기 유발물질 번호 표기법입니다.
              본인의 알레르기 항항목을 미리 설정하면 식단에서 자동으로 경고를 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 19 Allergies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>19가지 알레르기 유발물질 목록</span>
          <span className="text-xs font-normal text-slate-500">
            버튼을 클릭하여 본인의 알레르기를 설정하세요
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {codes.map((code) => {
            const allergy = ALLERGY_MAP[code];
            const isSelected = myAllergies.includes(code);

            return (
              <div
                key={code}
                onClick={() => onToggleAllergy(code)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs font-bold ring-2 ring-rose-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-75">#{code}</span>
                  <span className="text-xl">{allergy.icon}</span>
                </div>
                <div className="mt-2 text-sm font-semibold truncate">{allergy.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>유의사항</span>
        </div>
        <p className="leading-relaxed">
          - 급식 메뉴의 알레르기 정보는 조리 과정 및 식자재 수급 상황에 따라 일부 변경될 수 있습니다.
        </p>
        <p className="leading-relaxed">
          - 심각한 알레르기 질환이 있는 학생은 반드시 영양교사 또는 보건교사에게 사전 통지하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};
