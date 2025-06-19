from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
import uvicorn

# FastAPI 앱 생성 - 더 자세한 메타데이터 추가
app = FastAPI(
    title="AI 취재 디렉터 API",
    description="""
    ## AI 취재 디렉터 API

    노련한 선배 기자의 경험을 바탕으로 한 AI 취재 디렉팅 서비스입니다.

    ### 주요 기능:
    * **취재 디렉팅**: 현장 상황을 바탕으로 구조적 취재 방향 제시
    * **심화 분석**: 유사 사건 데이터 기반 비교 분석
    * **관점 확장**: 다양한 관점에서의 추가 인사이트 제공

    ### 사용법:
    1. `/direct` 엔드포인트로 현장 상황 전송
    2. 필요시 `/deep-dive`로 심화 분석 요청
    3. `/perspective`로 특정 관점에서 재분석
    """,
    version="1.0.0",
    contact={
        "name": "AI 취재 디렉터 팀",
        "email": "support@ai-reporter.com",
    },
    license_info={
        "name": "MIT License",
    },
)

# CORS 설정 - 모든 도메인 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=False,  # 모든 도메인 허용시에는 False로 설정해야 함
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 라우터 등록
app.include_router(router, prefix="/api")

# 루트 경로
@app.get("/", tags=["Root"])
async def root():
    """API 루트 엔드포인트"""
    return {
        "message": "AI 취재 디렉터 API에 오신 것을 환영합니다!",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )

# 헬스 체크 엔드포인트 추가
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API server is running"} 