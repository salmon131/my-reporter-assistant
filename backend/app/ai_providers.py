from abc import ABC, abstractmethod
import google.generativeai as genai
from app.config import GEMINI_API_KEY, GEMINI_MODEL

class AIProvider(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str) -> str:
        pass

class GeminiProvider(AIProvider):
    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("Gemini API 키가 설정되지 않았습니다.")
        
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)

    async def generate_response(self, prompt: str) -> str:
        try:
            system_prompt = "당신은 노련한 선배 기자입니다. 다음 현장 상황에 대해 JSON 형식으로 응답해주세요."
            full_prompt = f"{system_prompt}\n\n현장 상황: {prompt}"
            
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API 오류: {str(e)}")

def get_ai_provider() -> AIProvider:
    """AI 프로바이더 팩토리 함수"""
    try:
        return GeminiProvider()
    except Exception as e:
        raise Exception(f"AI 프로바이더 초기화 오류: {str(e)}") 