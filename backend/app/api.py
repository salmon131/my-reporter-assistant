from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from app.models import (
    SituationRequest, 
    DirectorResponse,
    DeepDiveResponse, 
    PerspectiveResponse,
    ErrorResponse,
    TopicRequest,
    PerspectiveRequest
)
from app.gemini_utils import get_directing, get_deep_dive, get_perspective
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health", 
    summary="서버 상태 확인",
    description="API 서버의 상태를 확인합니다.",
    response_model=dict)
async def health_check():
    """서버 상태 확인"""
    return {
        "status": "healthy", 
        "message": "AI 취재 디렉터 API 서버가 정상 작동 중입니다.",
        "version": "1.0.0"
    }

@router.post("/direct",
    summary="AI 취재 디렉팅",
    description="현장 상황을 바탕으로 노련한 선배 기자의 취재 디렉팅을 제공합니다.",
    response_model=DirectorResponse,
    responses={
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    })
async def direct(request: SituationRequest):
    """
    현장 상황을 바탕으로 AI 디렉팅 제공
    
    - **situation**: 현장 상황을 구체적으로 설명해주세요
    - 구조적이고 비판적인 취재 방향을 제시합니다
    - 권력과 제도에 대한 비판적 시각을 중시합니다
    """
    try:
        response = await get_directing(request.situation)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deep-dive",
    summary="심화 분석",
    description="주제에 대한 심화 분석을 제공합니다.",
    response_model=DeepDiveResponse,
    responses={
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    })
async def deep_dive(request: TopicRequest):
    """심화 분석 제공"""
    try:
        logger.info(f"심화 분석 요청: {request.topic}")
        
        if not request.topic:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="분석할 주제를 입력해주세요."
            )
        
        response = await get_deep_dive(request.topic)
        logger.info("심화 분석 완료")
        return response
        
    except Exception as e:
        logger.error(f"심화 분석 오류: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/perspective",
    summary="관점 확장 분석",
    description="특정 관점에서 상황을 재분석하고 추가 인사이트를 제공합니다.",
    response_model=PerspectiveResponse,
    responses={
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    })
async def perspective(request: PerspectiveRequest):
    """
    관점 확장 분석
    
    - **situation**: 분석할 현장 상황
    - 특정 관점에서의 추가 쟁점과 정책 포인트를 제시합니다
    """
    try:
        logger.info(f"관점 확장 요청: {request.situation[:50]}...")
        
        if not request.situation or len(request.situation.strip()) < 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="상황 설명을 입력해주세요."
            )
        
        response = await get_perspective(request.situation, request.perspective)
        logger.info("관점 확장 응답 성공")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"관점 확장 처리 오류: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"관점 확장 처리 중 오류가 발생했습니다: {str(e)}"
        )

# 예시 데이터 조회 엔드포인트
@router.get("/examples",
    summary="예시 상황들",
    description="테스트용 예시 상황들을 제공합니다.",
    response_model=dict)
async def get_examples():
    """테스트용 예시 상황들"""
    return {
        "examples": [
            {
                "title": "흉기 위협 사건",
                "situation": "구로구에서 만취 남성이 흉기를 들고 행인을 위협했다. 경찰이 출동했지만 용의자는 도주한 상태다. 목격자들은 용의자가 평소 정신적 문제가 있어 보였다고 증언하고 있다."
            },
            {
                "title": "아파트 화재",
                "situation": "강남구 아파트에서 화재가 발생해 주민 50여 명이 대피했다. 소방당국은 전기 합선으로 추정된다고 발표했지만, 주민들은 건물 노후화와 안전 점검 부실을 지적하고 있다."
            },
            {
                "title": "교통사고",
                "situation": "고속도로에서 승용차와 화물차가 충돌해 3명이 사망했다. 사고 당시 비가 내리고 있었으며, 해당 구간은 과거에도 사고가 자주 발생한 곳으로 알려져 있다."
            }
        ],
        "perspectives": [
            "사회적 관점",
            "경제적 관점", 
            "법적 관점",
            "정책적 관점",
            "인권적 관점",
            "환경적 관점"
        ]
    } 