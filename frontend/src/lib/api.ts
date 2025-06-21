import { DirectorResponse, DeepDiveResponse, PerspectiveResponse } from '@/types';

export const API_BASE_URL = 'http://localhost:8000';
export const API_PREFIX = '/api';  // /v1 제거

// 디버깅용 로그 함수
const debugLog = (message: string, data?: any) => {
  console.log(`[API Debug] ${message}`, data || '');
};

// API 서버 연결 테스트
export async function testApiConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const testUrls = [
    `${API_BASE_URL}${API_PREFIX}/health`
  ];

  debugLog('API 연결 테스트 시작', { baseUrl: API_BASE_URL, testUrls });

  for (const url of testUrls) {
    try {
      debugLog(`테스트 중: ${url}`);
      const response = await fetch(url, {
        method: 'GET'
      });
      
      debugLog(`응답 상태: ${response.status}`, { url });
      
      if (response.ok) {
        const data = await response.json();
        debugLog('연결 성공!', { url, data });
        return { 
          success: true, 
          message: `API 서버 연결 성공: ${url}`, 
          details: { url, status: response.status, data } 
        };
      }
    } catch (error) {
      debugLog(`연결 실패: ${url}`, error);
    }
  }

  return { 
    success: false, 
    message: '모든 API 엔드포인트 연결 실패',
    details: { testedUrls: testUrls }
  };
}

// API 서버 상태 확인 (개선된 버전)
export async function checkApiHealth(): Promise<boolean> {
  try {
    const testResult = await testApiConnection();
    return testResult.success;
  } catch (error) {
    debugLog('API 상태 확인 실패', error);
    return false;
  }
}

// 예시 데이터 가져오기
export async function getExamples(): Promise<any> {
  try {
    const url = `${API_BASE_URL}${API_PREFIX}/examples`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('예시 데이터 요청 오류:', error);
    throw error;
  }
}

export async function getDirecting(situation: string): Promise<DirectorResponse> {
  try {
    const url = `${API_BASE_URL}${API_PREFIX}/direct`;
    const requestBody = { situation };
    
    console.log('디렉팅 요청:', { url, body: requestBody });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('디렉팅 요청 오류:', error);
    throw error;
  }
}

export async function getDeepDive(topic: string): Promise<DeepDiveResponse> {
  try {
    const url = `${API_BASE_URL}${API_PREFIX}/deep-dive`;
    const requestBody = { topic };
    
    console.log('심화 분석 요청:', { url, body: requestBody });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('심화 분석 요청 오류:', error);
    throw error;
  }
}

export async function getPerspective(situation: string, perspective: string): Promise<PerspectiveResponse> {
  const url = `${API_BASE_URL}${API_PREFIX}/perspective`;
  const requestBody = { situation, perspective };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API 오류: ${response.status}`);
  }

  return await response.json();
}

export async function getNewsSearch(topic: string) {
  const url = `${API_BASE_URL}${API_PREFIX}/news-search`;
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function getNewsAnalyze(news_articles: string[]) {
  const url = `${API_BASE_URL}${API_PREFIX}/news-analyze`;
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ news_articles }) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
} 