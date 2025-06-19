import json
import google.generativeai as genai
from app.config import GEMINI_API_KEY
import logging

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

async def get_directing(situation: str) -> dict:
    model = init_gemini()
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
        response = model.generate_content(prompt)
        # JSON 응답 정제 및 파싱
        return clean_json_response(response.text)
    except Exception as e:
        raise Exception(f"Gemini API 오류: {str(e)}")

async def get_deep_dive(topic: str) -> dict:
    model = init_gemini()
    prompt = f"""
    다음 주제에 대해 심층적으로 분석해주세요: {topic}
    
    아래 JSON 형식으로만 응답해주세요. 다른 텍스트나 마크다운은 포함하지 마세요:
    {{
        "background": "배경 설명",
        "keyPoints": ["핵심 포인트 1", "핵심 포인트 2"],
        "analysis": "상세 분석",
        "implications": ["시사점 1", "시사점 2"]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        if not response or not response.text:
            raise ValueError("Gemini API가 빈 응답을 반환했습니다.")
            
        # JSON 응답 정제 및 파싱
        cleaned_response = clean_json_response(response.text)
        
        # 응답 구조 검증
        required_fields = ["background", "keyPoints", "analysis", "implications"]
        for field in required_fields:
            if field not in cleaned_response:
                raise ValueError(f"응답에 필수 필드가 누락되었습니다: {field}")
        
        return cleaned_response
        
    except Exception as e:
        logger.error(f"심화 분석 오류: {str(e)}")
        raise Exception(f"심화 분석 처리 중 오류가 발생했습니다: {str(e)}")

async def get_perspective(situation: str, perspective: str) -> dict:
    model = init_gemini()
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
        response = model.generate_content(prompt)
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