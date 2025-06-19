'use client';

import { PerspectiveResponse } from '@/types';

interface PerspectiveOutputProps {
  response: PerspectiveResponse;
}

export default function PerspectiveOutput({ response }: PerspectiveOutputProps) {
  const getPerspectiveConfig = (perspective: string) => {
    switch (perspective) {
      case '정치':
        return {
          color: 'red',
          gradient: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        };
      case '경제':
        return {
          color: 'green',
          gradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        };
      case '사회':
        return {
          color: 'blue',
          gradient: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        };
      case '법제도':
        return {
          color: 'purple',
          gradient: 'from-purple-50 to-violet-50',
          border: 'border-purple-200',
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          )
        };
      default:
        return {
          color: 'gray',
          gradient: 'from-gray-50 to-slate-50',
          border: 'border-gray-200',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )
        };
    }
  };

  return (
    <div className="space-y-6">
      {response.perspectives.map((perspective, idx) => {
        const config = getPerspectiveConfig(perspective.viewpoint);
        return (
          <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* 헤더 */}
            <div className={`bg-gradient-to-r ${config.gradient} ${config.border} px-6 py-6`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${config.text}`}>
                    {perspective.viewpoint} 관점 분석
                  </h2>
                  <p className={`text-sm ${config.text} opacity-80 mt-1`}>
                    다각적 시각에서 바라본 분석 결과
                  </p>
                </div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="p-6 space-y-6">
              {/* 쟁점 */}
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${config.text} flex items-center`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  주요 쟁점
                </h3>
                <div className={`bg-gradient-to-br ${config.gradient} rounded-xl p-4`}>
                  <ul className="space-y-3">
                    {perspective.issues.map((issue, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-${config.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                        <span className={`${config.text} leading-relaxed`}>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 질문 */}
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${config.text} flex items-center`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  핵심 질문
                </h3>
                <div className={`bg-gradient-to-br ${config.gradient} rounded-xl p-4`}>
                  <ul className="space-y-3">
                    {perspective.questions.map((question, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-${config.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                        <span className={`${config.text} leading-relaxed`}>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 시사점 */}
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${config.text} flex items-center`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  정책 시사점
                </h3>
                <div className={`bg-gradient-to-br ${config.gradient} rounded-xl p-4`}>
                  <ul className="space-y-3">
                    {perspective.implications.map((point, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-${config.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                        <span className={`${config.text} leading-relaxed`}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 