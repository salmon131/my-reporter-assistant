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