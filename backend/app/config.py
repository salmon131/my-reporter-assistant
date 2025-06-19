# 환경설정 파일 (예시)

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# Gemini 설정
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-pro"

def validate_config():
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API 키가 설정되지 않았습니다.")

# 설정 검증 실행
validate_config()

# 모델 설정
OPENAI_MODEL = "gpt-3.5-turbo"

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data") 