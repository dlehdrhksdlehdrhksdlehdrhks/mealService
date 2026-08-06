import React from 'react';
import { Utensils, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Utensils className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-bold text-base block">학교 급식 정보 다이어리</span>
              <span className="text-xs text-slate-400">
                교육부 나이스(NEIS) 오픈 API 실시간 데이터 연동
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href="https://open.neis.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>나이스 교육정보 개방 포털</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center md:text-left flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 학교 급식 다이어리. Powered by NEIS Open API. Built with React & Tailwind CSS.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Vercel Deployable Ready</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
