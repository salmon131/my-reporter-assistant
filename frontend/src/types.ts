// 백엔드 모델과 일치하는 타입 정의
export interface QuestionGroup {
  target: string;
  questions: string[];
}

export interface DirectorResponse {
  issues: string[];
  questions: QuestionGroup[];
  angles: string[];
  interpretation: string;
  additionalPoints: string[];
  checklist: string[];
}

export interface DeepDiveResponse {
  background: string;
  keyPoints: string[];
  analysis: string;
  implications: string[];
}

export interface Perspective {
  viewpoint: string;
  issues: string[];
  questions: string[];
  implications: string[];
}

export interface PerspectiveResponse {
  perspectives: Perspective[];
}

// === [news-search, news-analyze API용 타입 추가] ===
export interface NewsSearchResponse {
  news_articles: string[]; // 네이버 뉴스 기사 원문 리스트
}

export interface NewsAnalyzeRequest {
  news_articles: string[]; // 분석할 기사 원문 리스트
}

export interface ArticleAnalysis {
  article_index: number;
  title: string;
  angles?: string[];
  issues?: string[];
  framing?: string;
  implications?: string[];
}

export interface NewsAnalyzeResponse {
  article_analyses: ArticleAnalysis[];
  summary: string; // 종합 요약
} 