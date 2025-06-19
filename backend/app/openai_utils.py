# OpenAI API 연동 유틸 (더미 함수)

import os
import json
import re
from openai import OpenAI
from app.config import AZURE_OPENAI_API_KEY
from app.data_utils import search_similar_cases
import logging

logger = logging.getLogger(__name__)

# OpenAI 클라이언트 초기화
try:
    client = OpenAI(api_key=AZURE_OPENAI_API_KEY)
    logger.info("OpenAI 클라이언트 초기화 성공")
except Exception as e:
    logger.error(f"OpenAI 클라이언트 초기화 실패: {e}")
    client = None

def extract_json_from_text(text: str) -> dict:
    """텍스트에서 JSON 추출"""
    try:
        # JSON 블록 찾기 (```json...``` 또는 {...})
        json_pattern = r'```json\s*(.*?)\s*```'
        match = re.search(json_pattern, text, re.DOTALL)
        
        if match:
            json_str = match.group(1)
        else:
            # 중괄호로 시작하는 JSON 찾기
            brace_start = text.find('{')
            brace_end = text.rfind('}')
            if brace_start != -1 and brace_end != -1:
                json_str = text[brace_start:brace_end+1]
            else:
                json_str = text
        
        return json.loads(json_str)
    except Exception as e:
        logger.error(f"JSON 추출 실패: {e}")
        return None

def get_directing(situation):
    """현장 상황을 바탕으로 AI 디렉팅 제공"""
    
    if not client:
        return {
            "issues": ["OpenAI API 클라이언트가 초기화되지 않았습니다."],
            "questions": [{"target": "시스템", "questions": ["API 키를 확인해주세요."]}],
            "angles": ["기술적 오류"],
            "interpretation": "OpenAI API 설정을 확인해주세요.",
            "additionalPoints": ["API 키가 유효한지 확인하세요."],
            "checklist": ["시스템 점검"]
        }
    
    prompt = f"""
현장 상황: {situation}

위 상황을 바탕으로 노련한 선배 기자의 취재 디렉팅을 제공해주세요.

반드시 다음 JSON 형식으로만 응답해주세요:

{{
    "issues": ["핵심 쟁점 1", "핵심 쟁점 2", "핵심 쟁점 3"],
    "questions": [
        {{
            "target": "경찰/수사기관",
            "questions": ["구체적 질문 1", "구체적 질문 2", "구체적 질문 3"]
        }},
        {{
            "target": "피해자/목격자",
            "questions": ["구체적 질문 1", "구체적 질문 2"]
        }},
        {{
            "target": "전문가",
            "questions": ["구체적 질문 1", "구체적 질문 2"]
        }}
    ],
    "angles": ["보도 각도 1", "보도 각도 2", "보도 각도 3"],
    "interpretation": "구조적 해석 (왜 이런 일이 반복되는가? 제도적 맥락은?)",
    "additionalPoints": ["추가 취재 포인트 1", "추가 취재 포인트 2", "추가 취재 포인트 3"],
    "checklist": ["현장 체크리스트 1", "현장 체크리스트 2", "현장 체크리스트 3"]
}}

JSON 형식 외에는 다른 텍스트를 포함하지 마세요.
"""

    try:
        logger.info(f"OpenAI API 호출 시작 - 상황: {situation[:50]}...")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # gpt-4 대신 더 안정적인 gpt-3.5-turbo 사용
            messages=[
                {
                    "role": "system", 
                    "content": "당신은 30년 경력의 노련한 선배 기자입니다. 구조적이고 비판적인 취재 디렉팅을 JSON 형식으로만 제공합니다."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        logger.info(f"OpenAI 응답 받음: {content[:100]}...")
        
        # JSON 파싱 시도
        parsed_json = extract_json_from_text(content)
        
        if parsed_json:
            logger.info("JSON 파싱 성공")
            return parsed_json
        else:
            logger.error("JSON 파싱 실패")
            # 파싱 실패 시 기본 응답
            return {
                "issues": [f"응답 파싱 오류 - 원본: {content[:100]}..."],
                "questions": [{"target": "시스템", "questions": ["다시 시도해주세요."]}],
                "angles": ["기술적 오류"],
                "interpretation": "AI 응답을 파싱하는 중 오류가 발생했습니다.",
                "additionalPoints": ["다시 시도해주세요."],
                "checklist": ["시스템 확인"]
            }
            
    except Exception as e:
        logger.error(f"OpenAI API 호출 오류: {e}")
        return {
            "issues": [f"API 오류: {str(e)}"],
            "questions": [{"target": "시스템", "questions": ["OpenAI API 연결을 확인해주세요."]}],
            "angles": ["기술적 오류"],
            "interpretation": "OpenAI API 연결에 문제가 발생했습니다.",
            "additionalPoints": ["API 키와 네트워크 상태를 확인해주세요."],
            "checklist": ["시스템 점검"]
        }

def get_deep_dive(situation):
    """CSV 데이터 기반 심화 분석"""
    
    if not client:
        return {
            "similarCases": [],
            "statistics": ["OpenAI API 클라이언트가 초기화되지 않았습니다."],
            "comparativeAnalysis": ["API 키를 확인해주세요."],
            "additionalQuestions": ["시스템 점검이 필요합니다."]
        }
    
    # 데이터에서 유사 사건 검색
    try:
        similar_cases = search_similar_cases(situation)
        logger.info(f"유사 사건 검색 완료: {len(similar_cases) if similar_cases else 0}건")
    except Exception as e:
        logger.error(f"유사 사건 검색 오류: {e}")
        similar_cases = "유사 사건 데이터를 찾을 수 없습니다."
    
    prompt = f"""
현장 상황: {situation}

유사 사건/데이터: {similar_cases}

위 데이터를 바탕으로 심화 분석을 제공해주세요.

반드시 다음 JSON 형식으로만 응답해주세요:

{{
    "similarCases": [
        {{
            "date": "2023-11-12",
            "title": "유사 사건 제목",
            "summary": "사건 요약"
        }}
    ],
    "statistics": ["통계 정보 1", "통계 정보 2", "통계 정보 3"],
    "comparativeAnalysis": ["비교 분석 1", "비교 분석 2", "비교 분석 3"],
    "additionalQuestions": ["데이터 기반 추가 질문 1", "데이터 기반 추가 질문 2"]
}}

JSON 형식 외에는 다른 텍스트를 포함하지 마세요.
"""
    
    try:
        logger.info("심화 분석 OpenAI API 호출 시작")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 데이터 분석 전문 기자입니다. JSON 형식으로만 응답합니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content.strip()
        logger.info(f"심화 분석 응답 받음: {content[:100]}...")
        
        parsed_json = extract_json_from_text(content)
        
        if parsed_json:
            logger.info("심화 분석 JSON 파싱 성공")
            return parsed_json
        else:
            logger.error(f"심화 분석 JSON 파싱 실패 - 원본: {content}")
            return {
                "similarCases": [],
                "statistics": [f"응답 파싱 오류 - 원본: {content[:50]}..."],
                "comparativeAnalysis": ["다시 시도해주세요."],
                "additionalQuestions": ["시스템 확인이 필요합니다."]
            }
            
    except Exception as e:
        logger.error(f"심화 분석 API 오류: {e}")
        return {
            "similarCases": [],
            "statistics": [f"API 오류: {str(e)}"],
            "comparativeAnalysis": ["OpenAI API 연결을 확인해주세요."],
            "additionalQuestions": ["시스템 점검이 필요합니다."]
        }

def get_perspective(situation, perspective):
    """관점 확장 분석"""
    
    if not client:
        return {
            "perspective": perspective,
            "additionalIssues": ["OpenAI API 클라이언트가 초기화되지 않았습니다."],
            "specificQuestions": ["API 키를 확인해주세요."],
            "policyPoints": ["시스템 점검이 필요합니다."]
        }
    
    prompt = f"""
현장 상황: {situation}
분석 관점: {perspective}

위 상황을 {perspective} 관점에서 추가 분석해주세요.

반드시 다음 JSON 형식으로만 응답해주세요:

{{
    "perspective": "{perspective}",
    "additionalIssues": ["추가 쟁점 1", "추가 쟁점 2", "추가 쟁점 3"],
    "specificQuestions": ["구체적 질문 1", "구체적 질문 2", "구체적 질문 3"],
    "policyPoints": ["정책/제도 포인트 1", "정책/제도 포인트 2", "정책/제도 포인트 3"]
}}

JSON 형식 외에는 다른 텍스트를 포함하지 마세요.
"""
    
    try:
        logger.info(f"관점 확장 OpenAI API 호출 시작 - 관점: {perspective}")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"당신은 {perspective} 분야 전문 기자입니다. JSON 형식으로만 응답합니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1200
        )
        
        content = response.choices[0].message.content.strip()
        logger.info(f"관점 확장 응답 받음: {content[:100]}...")
        
        parsed_json = extract_json_from_text(content)
        
        if parsed_json:
            logger.info("관점 확장 JSON 파싱 성공")
            return parsed_json
        else:
            logger.error(f"관점 확장 JSON 파싱 실패 - 원본: {content}")
            return {
                "perspective": perspective,
                "additionalIssues": [f"응답 파싱 오류 - 원본: {content[:50]}..."],
                "specificQuestions": ["다시 시도해주세요."],
                "policyPoints": ["시스템 확인이 필요합니다."]
            }
            
    except Exception as e:
        logger.error(f"관점 확장 API 오류: {e}")
        return {
            "perspective": perspective,
            "additionalIssues": [f"API 오류: {str(e)}"],
            "specificQuestions": ["OpenAI API 연결을 확인해주세요."],
            "policyPoints": ["시스템 점검이 필요합니다."]
        } 