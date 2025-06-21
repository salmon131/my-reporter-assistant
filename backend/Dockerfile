# Python 3.10 베이스 이미지 사용
FROM python:3.10

# Node.js 18.x 설치
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 복사 및 Python 패키지 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 앱 소스 복사
COPY . .

# 포트 노출
EXPOSE 8000

# uvicorn으로 FastAPI 실행 (hot reload는 개발용, 운영시 reload 옵션 제거 가능)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 