'use client';

import { useState, useEffect } from 'react';
import SituationInput from '@/components/SituationInput';
import DirectorOutput from '@/components/DirectorOutput';
import DeepDiveOutput from '@/components/DeepDiveOutput';
import PerspectiveOutput from '@/components/PerspectiveOutput';
import Notes from '@/components/Notes';
import { getDirecting, getDeepDive, getPerspective, checkApiHealth, testApiConnection } from '@/lib/api';
import { DirectorResponse, DeepDiveResponse, PerspectiveResponse } from '@/types';

export default function Home() {
  // 상태 관리
  const [currentSituation, setCurrentSituation] = useState<string>('');
  const [directorResponse, setDirectorResponse] = useState<DirectorResponse | null>(null);
  const [deepDiveResponse, setDeepDiveResponse] = useState<DeepDiveResponse | null>(null);
  const [perspectiveResponse, setPerspectiveResponse] = useState<PerspectiveResponse | null>(null);
  
  // 로딩 상태
  const [isDirectorLoading, setIsDirectorLoading] = useState(false);
  const [isDeepDiveLoading, setIsDeepDiveLoading] = useState(false);
  const [isPerspectiveLoading, setIsPerspectiveLoading] = useState(false);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // API 서버 상태 및 연결 테스트 상태
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  // API 연결 테스트
  const runApiTest = async () => {
    setApiStatus('checking');
    const testResult = await testApiConnection();
    setConnectionDetails(testResult);
    setApiStatus(testResult.success ? 'online' : 'offline');
  };

  useEffect(() => {
    runApiTest();
    // 30초마다 API 상태 확인
    const interval = setInterval(runApiTest, 30000);
    return () => clearInterval(interval);
  }, []);

  // 디렉팅 요청 처리
  const handleDirecting = async (situation: string) => {
    console.log('=== 디렉팅 요청 시작 ===');
    console.log('API 상태:', apiStatus);
    console.log('상황:', situation);

    if (apiStatus === 'offline') {
      setError('API 서버가 오프라인 상태입니다. 백엔드 서버를 시작해주세요.');
      return;
    }

    setIsDirectorLoading(true);
    setError(null);
    setCurrentSituation(situation);
    
    // 이전 결과 초기화
    setDirectorResponse(null);
    setDeepDiveResponse(null);
    setPerspectiveResponse(null);

    try {
      const response = await getDirecting(situation);
      console.log('디렉팅 응답 성공:', response);
      setDirectorResponse(response);
    } catch (err) {
      console.error('디렉팅 요청 실패:', err);
      setError(err instanceof Error ? err.message : '디렉팅 요청 중 오류가 발생했습니다.');
    } finally {
      setIsDirectorLoading(false);
    }
  };

  // 심화 분석 요청 처리
  const handleDeepDive = async (topic: string) => {
    try {
      setIsDeepDiveLoading(true);
      const response = await getDeepDive(topic);
      setDeepDiveResponse(response);
    } catch (error) {
      console.error('심화 분석 요청 실패:', error);
      // 사용자에게 에러 메시지 표시
      setError(error instanceof Error ? error.message : '심화 분석 중 오류가 발생했습니다.');
    } finally {
      setIsDeepDiveLoading(false);
    }
  };

  // 관점 확장 요청 처리
  const handlePerspective = async (perspective: string) => {
    if (!currentSituation || apiStatus === 'offline') return;

    setIsPerspectiveLoading(true);
    setError(null);

    try {
      // 관점 정보를 함께 전달
      const response = await getPerspective(currentSituation, perspective);
      setPerspectiveResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '관점 확장 요청 중 오류가 발생했습니다.');
    } finally {
      setIsPerspectiveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 현대적인 헤더 */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  AI 취재 디렉터
                </h1>
                <p className="text-sm text-gray-500 font-medium">Professional Journalism Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* API 상태 표시 */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                apiStatus === 'online' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : apiStatus === 'offline' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  apiStatus === 'online' ? 'bg-green-500' :
                  apiStatus === 'offline' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className="font-semibold">
                  {apiStatus === 'online' ? '온라인' :
                   apiStatus === 'offline' ? '오프라인' :
                   '확인 중'}
                </span>
              </div>
              
              {/* API 테스트 버튼 */}
              <button
                onClick={runApiTest}
                disabled={apiStatus === 'checking'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {apiStatus === 'checking' ? '테스트 중...' : '연결 테스트'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 알림 메시지들 */}
      {connectionDetails && apiStatus === 'offline' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">백엔드 서버 연결 실패</h3>
                <p className="mt-1 text-sm text-red-700">
                  {connectionDetails.message}
                </p>
                <div className="mt-2 text-xs text-red-600">
                  <strong>해결 방법:</strong> 터미널에서 <code className="bg-red-100 px-2 py-1 rounded">cd backend && uvicorn app.main:app --reload --port 8000</code> 실행
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">오류 발생</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* 왼쪽 영역 - 입력 및 주요 결과 */}
          <div className="xl:col-span-8 space-y-8">
            {/* 상황 입력 */}
            <SituationInput 
              onSubmit={handleDirecting}
              isLoading={isDirectorLoading}
            />

            {/* 디렉터 응답 */}
            {directorResponse && (
              <DirectorOutput
                response={directorResponse}
                onDeepDive={handleDeepDive}
                onPerspective={handlePerspective}
                isDeepDiveLoading={isDeepDiveLoading}
                isPerspectiveLoading={isPerspectiveLoading}
              />
            )}

            {/* 심화 분석 결과 */}
            {deepDiveResponse && (
              <DeepDiveOutput response={deepDiveResponse} />
            )}

            {/* 관점 확장 결과 */}
            {perspectiveResponse && (
              <PerspectiveOutput response={perspectiveResponse} />
            )}
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* 기자 메모 */}
              {directorResponse && <Notes />}
              
              {/* 취재 도구 패널 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  취재 도구
                </h3>
                <div className="space-y-4">
                  <button className="w-full group p-4 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-900">질문 템플릿</p>
                        <p className="text-sm text-gray-500">자주 사용하는 질문 저장</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full group p-4 hover:bg-green-50 rounded-xl transition-all duration-200 border border-transparent hover:border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 group-hover:text-green-900">취재 타이머</p>
                        <p className="text-sm text-gray-500">시간 관리 도구</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 빠른 액션 패널 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  빠른 액션
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 text-center group">
                    <div className="text-blue-600 font-semibold text-sm group-hover:text-blue-800">새 취재</div>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 text-center group">
                    <div className="text-green-600 font-semibold text-sm group-hover:text-green-800">저장</div>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 text-center group">
                    <div className="text-purple-600 font-semibold text-sm group-hover:text-purple-800">내보내기</div>
                  </button>
                  <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-200 text-center group">
                    <div className="text-orange-600 font-semibold text-sm group-hover:text-orange-800">공유</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
