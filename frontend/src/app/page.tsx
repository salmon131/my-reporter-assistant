'use client';

import { useState, useEffect } from 'react';
import SituationInput from '@/components/SituationInput';
import DirectorOutput from '@/components/DirectorOutput';
import DeepDiveOutput from '@/components/DeepDiveOutput';
import PerspectiveOutput from '@/components/PerspectiveOutput';
import Notes from '@/components/Notes';
import { getDirecting, getDeepDive, getPerspective, checkApiHealth, testApiConnection, getNewsSearch, getNewsAnalyze } from '@/lib/api';
import { DirectorResponse, PerspectiveResponse, NewsSearchResponse, NewsAnalyzeResponse } from '@/types';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  // 상태 관리
  const [currentSituation, setCurrentSituation] = useState<string>('');
  const [directorResponse, setDirectorResponse] = useState<DirectorResponse | null>(null);
  const [perspectiveResponse, setPerspectiveResponse] = useState<PerspectiveResponse | null>(null);
  
  // 로딩 상태
  const [isDirectorLoading, setIsDirectorLoading] = useState(false);
  const [isPerspectiveLoading, setIsPerspectiveLoading] = useState(false);
  const [isNewsSearchLoading, setIsNewsSearchLoading] = useState(false);
  const [isNewsAnalyzeLoading, setIsNewsAnalyzeLoading] = useState(false);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // API 서버 상태 및 연결 테스트 상태
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  const [newsArticles, setNewsArticles] = useState<string[] | null>(null); // 1단계 결과
  const [analyzeResult, setAnalyzeResult] = useState<NewsAnalyzeResponse | null>(null); // 2단계 결과

  // 컴포넌트 함수 시작부에 추가
  const [summaryOpen, setSummaryOpen] = useState(true);

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
    setDirectorResponse(null);
    setPerspectiveResponse(null);
    setNewsArticles(null);
    setAnalyzeResult(null);

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

  // 1단계: 네이버 뉴스 기사 검색
  const handleNewsSearch = async (topic?: string) => {
    const searchTopic = topic || currentSituation;
    if (!searchTopic) {
      setError('상황이 입력되지 않았습니다.');
      return;
    }
    setIsNewsSearchLoading(true);
    setError(null);
    setNewsArticles(null);
    setAnalyzeResult(null);
    try {
      const response: NewsSearchResponse = await getNewsSearch(searchTopic);
      setNewsArticles(response.news_articles);
    } catch (error) {
      setError(error instanceof Error ? error.message : '뉴스 검색 중 오류가 발생했습니다.');
    } finally {
      setIsNewsSearchLoading(false);
    }
  };

  // 2단계: 기사별 분석
  const handleNewsAnalyze = async () => {
    if (!newsArticles) return;
    setIsNewsAnalyzeLoading(true);
    setError(null);
    setAnalyzeResult(null);
    try {
      const response: NewsAnalyzeResponse = await getNewsAnalyze(newsArticles);
      setAnalyzeResult(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : '뉴스 분석 중 오류가 발생했습니다.');
    } finally {
      setIsNewsAnalyzeLoading(false);
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
                onDeepDive={() => handleNewsSearch()}
                onPerspective={handlePerspective}
                isDeepDiveLoading={isNewsSearchLoading}
                isPerspectiveLoading={isPerspectiveLoading}
              />
            )}

            {/* 1단계: 뉴스 기사 원문 리스트 표시 및 2단계 버튼 */}
            {newsArticles && !analyzeResult && (
              <div className="space-y-4 bg-white/80 border border-blue-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-blue-800 mb-2">네이버 뉴스 기사 원문</h2>
                {Array.isArray(newsArticles) ? (
                  <ul className="space-y-2">
                    {newsArticles.map((article, idx) => (
                      <li key={idx} className="bg-blue-50 rounded p-3 text-blue-900 text-sm whitespace-pre-line">{article}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="prose max-w-none">
                    <ReactMarkdown>{newsArticles}</ReactMarkdown>
                  </div>
                )}
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={handleNewsAnalyze}
                  disabled={isNewsAnalyzeLoading}
                >
                  {isNewsAnalyzeLoading ? '분석 중...' : '분석하기'}
                </button>
              </div>
            )}

            {/* 2단계: 분석 결과 표시 (NewsAnalyzeOutput 컴포넌트로 대체 예정) */}
            {analyzeResult && (
              <div className="space-y-8">
                {/* 종합 요약 (마크다운, expander) */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200 rounded-3xl shadow-lg p-8 mb-8">
                  <button
                    className="flex items-center gap-2 mb-4 text-emerald-900 hover:text-emerald-700 font-extrabold text-2xl focus:outline-none"
                    onClick={() => setSummaryOpen((v) => !v)}
                    aria-expanded={summaryOpen}
                    aria-controls="summary-content"
                  >
                    <svg className={`w-7 h-7 text-emerald-500 transition-transform duration-200 ${summaryOpen ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    종합 요약
                    <span className="ml-2 text-base font-normal text-emerald-600">(클릭하여 {summaryOpen ? '접기' : '펼치기'})</span>
                  </button>
                  {summaryOpen && (
                    <div id="summary-content" className="prose prose-emerald max-w-none text-lg animate-fade-in">
                      <ReactMarkdown>{analyzeResult.summary}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {/* 기사별 분석 카드 */}
                <div className="grid md:grid-cols-2 gap-8">
                  {analyzeResult.article_analyses.map((a, idx) => (
                    <div key={idx} className="bg-white/90 border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="text-lg font-bold text-blue-900">{a.title}</span>
                      </div>
                      {/* angles */}
                      {a.angles && a.angles.length > 0 && (
                        <div className="mb-1">
                          <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                            보도 각도(Angle)
                            <span className="text-gray-400" title="이 기사가 어떤 시각/관점에서 보도되었는지 요약한 키워드입니다.">ⓘ</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {a.angles.map((angle, i) => (
                              <span key={i} className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">{angle}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* issues */}
                      {a.issues && a.issues.length > 0 && (
                        <div className="mb-1">
                          <div className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                            쟁점(Issue)
                            <span className="text-gray-400" title="이 기사에서 다루는 주요 쟁점, 논란, 사회적 문제 등입니다.">ⓘ</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {a.issues.map((issue, i) => (
                              <span key={i} className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">{issue}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* framing */}
                      {a.framing && (
                        <div className="mb-1">
                          <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                            프레이밍(Framing)
                            <span className="text-gray-400" title="이 기사가 사건을 어떤 틀(프레임)로 해석·구성했는지 요약한 문장입니다.">ⓘ</span>
                          </div>
                          <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-emerald-800 bg-emerald-50 rounded-lg my-2">
                            {a.framing}
                          </blockquote>
                        </div>
                      )}
                      {/* implications */}
                      {a.implications && a.implications.length > 0 && (
                        <div className="mb-1">
                          <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                            시사점(Implication)
                            <span className="text-gray-400" title="이 기사로부터 도출되는 정책적, 사회적, 실천적 시사점입니다.">ⓘ</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {a.implications.map((imp, i) => (
                              <span key={i} className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">{imp}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
