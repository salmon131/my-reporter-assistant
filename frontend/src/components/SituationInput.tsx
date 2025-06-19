'use client';

import { useState } from 'react';

interface SituationInputProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
}

export default function SituationInput({ onSubmit, isLoading }: SituationInputProps) {
  const [situation, setSituation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (situation.trim()) {
      onSubmit(situation.trim());
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">현장 상황 입력</h2>
            <p className="text-blue-100 mt-1 font-medium">취재 현장의 상황을 자세히 설명해보세요</p>
          </div>
        </div>
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-3">
          <label htmlFor="situation" className="block text-sm font-semibold text-gray-700">
            현장 상황
          </label>
          <textarea
            id="situation"
            name="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            placeholder="현재 취재하고 있는 현장의 상황을 자세히 설명해주세요. 예시: 시간, 장소, 인물, 사건의 전후 맥락, 현재 상황 등을 포함해주세요..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>상세한 설명일수록 더 정확한 분석이 가능합니다</span>
            <span>{situation.length}/1000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!situation.trim() || isLoading}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }
            text-white
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>AI 분석 중...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>분석 시작</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
} 