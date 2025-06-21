import sys
import asyncio
import json
import os
from dotenv import load_dotenv
from google import genai
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)

server_params = StdioServerParameters(
    command="npx",
    args=["-y", "@suekou/mcp-notion-server"],
    env={"NOTION_API_TOKEN": os.getenv("NOTION_API_TOKEN")}
)

async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 예시 프롬프트: 노션에서 전체 노트를 조회해줘.
            prompt = "노션에서 notion_search 툴을 써서 취재 테이블을 가져와"

            # MCP 세션 초기화
            await session.initialize()

            # Gemini 모델에 MCP 세션을 tool로 넘김
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",  # 또는 최신 gemini-2.5-flash
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    tools=[session],  # MCP tool 자동 호출
                ),
            )
            print(response.text)

if __name__ == "__main__":
    asyncio.run(run())
