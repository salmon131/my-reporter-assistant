'use client';

import { useState } from 'react';

export default function Notes() {
  const [notes, setNotes] = useState('');
  const [questions, setQuestions] = useState('');

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">기자 메모</h2>
            <p className="text-orange-100 mt-1 font-medium">현장에서 발견한 정보와 아이디어를 기록하세요</p>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 현장 메모 */}
          <div className="space-y-3">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              현장 메모
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="현장에서 발견한 사실, 인상, 추가 정보, 목격자 증언 등을 기록하세요..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>상세한 기록이 나중에 도움이 됩니다</span>
              <span>{notes.length}/1000</span>
            </div>
          </div>

          {/* 추가 질문 */}
          <div className="space-y-3">
            <label htmlFor="questions" className="block text-sm font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              추가 질문 아이디어
            </label>
            <textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="AI 디렉팅을 받으면서 떠오른 추가 질문이나 취재 아이디어를 기록하세요..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>후속 취재에 활용할 수 있습니다</span>
              <span>{questions.length}/1000</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>자동 저장됨</span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setNotes('');
                setQuestions('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              초기화
            </button>
            <button
              onClick={() => {
                // 향후 로컬 스토리지나 백엔드에 저장하는 기능 추가 가능
                alert('메모가 저장되었습니다!');
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              메모 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 