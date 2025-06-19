# AI 취재 디렉터

AI 기반 취재 보조 도구로, 현장 상황을 입력하면 취재 방향과 질문을 제시해주는 애플리케이션입니다.

## 🚀 기능

- **AI 디렉팅**: 현장 상황 분석 및 취재 방향 제시
- **관점별 분석**: 정치, 경제, 사회, 법제도 관점에서 분석
- **심화 분석**: 유사 사건 및 통계 데이터 분석
- **기자 메모**: 현장 메모 및 질문 아이디어 기록

## 🏗️ 프로젝트 구조

```
my-reporter-assistant/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # FastAPI 백엔드
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── README.md
└── .gitignore
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Vercel** - 배포 플랫폼

### Backend
- **FastAPI** - Python 웹 프레임워크
- **Google Gemini** - AI 모델
- **Railway** - 배포 플랫폼

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/my-reporter-assistant.git
cd my-reporter-assistant
```

### 2. Backend 설정
```bash
cd backend

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
echo "GEMINI_API_KEY=your_gemini_api_key" > .env

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend 설정
```bash
cd frontend

# 의존성 설치
npm install

# 환경변수 설정
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 개발 서버 실행
npm run dev
```

### 4. 브라우저에서 확인
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 🌐 배포

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway)
```bash
cd backend
railway up
```

## 📝 사용법

1. **현장 상황 입력**: 취재 현장의 상황을 자세히 입력
2. **AI 분석**: 핵심 쟁점, 질문, 보도 각도 확인
3. **관점별 분석**: 정치/경제/사회/법제도 관점에서 분석
4. **심화 분석**: 유사 사건 및 통계 데이터 확인
5. **메모 작성**: 현장 메모 및 추가 질문 기록

## 🔧 개발

### 코드 스타일
- Frontend: ESLint + Prettier
- Backend: Black + isort

### 테스트
```bash
# Frontend 테스트
cd frontend
npm test

# Backend 테스트
cd backend
pytest
```

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 