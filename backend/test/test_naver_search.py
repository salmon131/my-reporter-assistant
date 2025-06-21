import sys
import asyncio
import json
import os
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
from dotenv import load_dotenv
from google import genai
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)

# naver-search MCP 서버 파라미터
server_params = StdioServerParameters(
    command="npx",
    args=["-y", "@isnow890/naver-search-mcp"],
    env={
        "NAVER_CLIENT_ID": os.getenv("NAVER_CLIENT_ID"),
        "NAVER_CLIENT_SECRET": os.getenv("NAVER_CLIENT_SECRET"),
    }
)

async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 예시 프롬프트: 네이버 뉴스에서 삼성전자 주가 관련 기사 3개만 찾아줘.
            prompt = "네이버 뉴스에서 삼성전자 주가 관련 기사 3개만 찾아줘."

            # MCP 세션 초기화
            await session.initialize()

            # Gemini 모델에 MCP 세션을 tool로 넘김
            response = await client.aio.models.generate_content(
                model="gemini-1.5-flash",  # 또는 최신 gemini-2.5-flash
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    tools=[session],  # MCP tool 자동 호출
                ),
            )
            print(response.text)

asyncio.run(run())
