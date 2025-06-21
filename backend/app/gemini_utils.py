import json
import google.generativeai as genai
from app.config import GEMINI_API_KEY
import logging
import subprocess
from app.models import NewsArticle, ArticleAnalysis
import os
import sys
import asyncio
from agents.mcp import MCPServerStdio
from agents import Agent
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv
from google import genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

logger = logging.getLogger(__name__)

def init_gemini():
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel('gemini-2.0-flash-001')

def clean_json_response(response: str) -> dict:
    """마크다운 코드 블록과 불필요한 문자를 제거하고 JSON 파싱"""
    try:
        # 마크다운 코드 블록 제거
        cleaned = response.replace('```json', '').replace('```', '').strip()
        # JSON 파싱
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {str(e)}")

# 네이버 뉴스 MCP를 mcp 클라이언트로 호출하여 기사 리스트를 가져오는 함수
async def search_naver_news(query: str, max_results: int = 3):
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@isnow890/naver-search-mcp"],
        env={
            "NAVER_CLIENT_ID": os.getenv("NAVER_CLIENT_ID", "N0_XnayYPesgOcTS3Ae9"),
            "NAVER_CLIENT_SECRET": os.getenv("NAVER_CLIENT_SECRET", "xDMaSTrByr")
        }
    )
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            prompt = f"네이버 뉴스에서 '{query}'사건과 유사한 기사 {max_results}개만 찾아줘."
            tool_result = await client.aio.models.generate_content(
                model="gemini-2.5-flash",  # 또는 최신 gemini-2.5-flash
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    tools=[session],
                ),
            )
            return tool_result.text

# 기사별 Gemini 분석 함수
async def analyze_article_with_gemini(article_text: str) -> ArticleAnalysis:
    prompt = f"""
    아래는 네이버 뉴스에서 검색된 유사 기사들의 모음입니다. 각 기사별로 보도 각도, 주요 쟁점, 프레이밍, 시사점을 분석해줘. 기사별로 구분해서 결과를 구조화해줘.

    기사 모음:
    {article_text}

    아래 JSON 형식으로만 응답해. 다른 텍스트나 마크다운은 포함하지 마:
    {{
        "analyses": [
            {{
                "title": "기사 제목",
                "angles": ["보도 각도1", "보도 각도2"],
                "issues": ["주요 쟁점1", "주요 쟁점2"],
                "framing": "프레이밍 설명",
                "implications": ["시사점1", "시사점2"]
            }}
        ]
    }}
    """
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2,
            ),
        )
        result = clean_json_response(response.text)
        return result  # analyses 리스트 반환
    except Exception as e:
        logger.error(f"Gemini 기사 분석 오류: {e}")
        return {"analyses": [
            {"title": "분석 오류", "angles": [], "issues": [], "framing": None, "implications": [f"분석 오류: {e}"]}
        ]}

# 종합 분석 함수
async def summarize_articles_with_gemini(articles: list, analyses: list) -> str:
    # 기사별 요약 및 분석을 텍스트로 합침
    context = "\n".join([
        f"기사: {a.title}\n요약: {a.summary}\n보도 각도: {b.angles}\n쟁점: {b.issues}\n프레이밍: {b.framing}\n시사점: {b.implications}"
        for a, b in zip(articles, analyses)
    ])
    prompt = f"""
    다음은 여러 유사 뉴스 기사와 각 기사별 보도 각도/쟁점/프레이밍/시사점 분석 결과야.\n
    {context}

    이 기사들에서 반복적으로 등장하는 쟁점, 공통된 프레임, 사회적 시사점, 차이점 등을 종합적으로 요약해줘.\n
    1. 반복 쟁점/프레임\n2. 차이점\n3. 사회적 시사점\n4. 추가 취재 포인트\n
    간결하고 명확하게 정리해줘.
    """
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2,
            ),
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini 종합 분석 오류: {e}")
        return f"종합 분석 오류: {e}"

# 메인 심화 분석 함수 (더 이상 사용하지 않으므로 삭제)
# async def get_deep_dive(topic: str) -> dict:
#     ...
#     return DeepDiveResponse(...)

async def get_directing(situation: str) -> dict:
    prompt = f"""
    당신은 노련한 선배 기자입니다. 다음 현장 상황에 대해 분석해주세요.
    
    현장 상황: {situation}
    
    아래 JSON 형식으로만 응답해주세요. 다른 텍스트나 마크다운은 포함하지 마세요:
    {{
        "issues": ["핵심 쟁점 1", "핵심 쟁점 2", "핵심 쟁점 3"],
        "questions": [
            {{
                "target": "경찰/수사기관",
                "questions": ["질문 1", "질문 2", "질문 3"]
            }},
            {{
                "target": "피해자/목격자",
                "questions": ["질문 1", "질문 2"]
            }}
        ],
        "angles": ["보도 각도 1", "보도 각도 2"],
        "interpretation": "구조적 해석",
        "additionalPoints": ["추가 포인트 1", "추가 포인트 2"],
        "checklist": ["체크리스트 1", "체크리스트 2"]
    }}
    """
    
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2,
            ),
        )
        # JSON 응답 정제 및 파싱
        return clean_json_response(response.text)
    except Exception as e:
        raise Exception(f"Gemini API 오류: {str(e)}")

async def get_perspective(situation: str, perspective: str) -> dict:
    prompt = f"""
    당신은 노련한 선배 기자입니다. 다음 현장 상황을 '{perspective}' 관점에서 분석해주세요.
    
    현장 상황: {situation}
    
    다음 JSON 형식으로만 응답하세요. 다른 텍스트나 설명을 포함하지 마세요.
    반드시 아래 형식의 JSON을 그대로 사용하고, 각 필드를 빠짐없이 포함해야 합니다:

    {{
        "perspectives": [
            {{
                "viewpoint": "{perspective}",
                "issues": ["쟁점 1", "쟁점 2"],
                "questions": ["질문 1", "질문 2"],
                "implications": ["시사점 1", "시사점 2"]
            }}
        ]
    }}
    """
    
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2,
            ),
        )
        if not response or not response.text:
            raise ValueError("Gemini API가 빈 응답을 반환했습니다.")
            
        # JSON 응답 정제 및 파싱
        cleaned_response = clean_json_response(response.text)
        
        # 응답 구조 검증
        if "perspectives" not in cleaned_response:
            raise ValueError("응답에 'perspectives' 필드가 누락되었습니다.")
        
        if not isinstance(cleaned_response["perspectives"], list):
            raise ValueError("'perspectives'는 배열이어야 합니다.")
            
        for perspective in cleaned_response["perspectives"]:
            required_fields = ["viewpoint", "issues", "questions", "implications"]
            for field in required_fields:
                if field not in perspective:
                    raise ValueError(f"관점에 필수 필드가 누락되었습니다: {field}")
        
        return cleaned_response
        
    except Exception as e:
        logger.error(f"관점 확장 오류: {str(e)}")
        raise Exception(f"관점 확장 처리 중 오류가 발생했습니다: {str(e)}") 