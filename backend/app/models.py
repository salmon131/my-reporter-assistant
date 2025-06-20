from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# 요청 모델들
class SituationRequest(BaseModel):
    situation: str

class PerspectiveRequest(BaseModel):
    situation: str = Field(..., description="현장 상황 설명")
    perspective: str = Field(..., description="분석 관점", example="사회적 관점")

class TopicRequest(BaseModel):
    topic: str

# 응답 모델들
class QuestionGroup(BaseModel):
    target: str = Field(..., description="질문 대상", example="경찰/수사기관")
    questions: List[str] = Field(..., description="질문 목록")

class DirectorResponse(BaseModel):
    issues: List[str] = Field(..., description="핵심 쟁점들")
    questions: List[QuestionGroup] = Field(..., description="대상별 질문들")
    angles: List[str] = Field(..., description="보도 각도들")
    interpretation: str = Field(..., description="구조적 해석")
    additionalPoints: List[str] = Field(..., description="추가 취재 포인트들")
    checklist: List[str] = Field(..., description="현장 체크리스트")

class SimilarCase(BaseModel):
    date: str = Field(..., description="사건 날짜", example="2023-11-12")
    title: str = Field(..., description="사건 제목")
    summary: str = Field(..., description="사건 요약")

class NewsArticle(BaseModel):
    title: str
    date: str
    press: Optional[str] = None
    url: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None

class ArticleAnalysis(BaseModel):
    article_index: int  # NewsArticle의 인덱스
    title: str
    angles: List[str]
    issues: List[str]
    framing: Optional[str] = None
    implications: List[str]

# 1단계: 네이버 뉴스 검색 결과 반환
class NewsSearchResponse(BaseModel):
    news_articles: str  # 네이버 뉴스에서 검색된 기사 원문 텍스트

# 2단계: Gemini 기사 분석 요청
class NewsAnalyzeRequest(BaseModel):
    news_articles: str  # 1단계에서 받은 기사 원문 텍스트

# 2단계: Gemini 기사 분석 결과
class NewsAnalyzeResponse(BaseModel):
    article_analyses: List[ArticleAnalysis]
    summary: str

class Perspective(BaseModel):
    viewpoint: str
    issues: List[str]
    questions: List[str]
    implications: List[str]

class PerspectiveResponse(BaseModel):
    perspectives: List[Perspective]

# 에러 응답 모델
class ErrorResponse(BaseModel):
    error: str = Field(..., description="에러 메시지")
    detail: Optional[str] = Field(None, description="에러 상세 정보") 