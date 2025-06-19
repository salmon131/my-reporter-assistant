# CSV 데이터 파싱/검색 유틸 (기본 구조)

import os
import pandas as pd
import re
from app.config import DATA_DIR

def extract_keywords(situation):
    """상황에서 키워드 추출"""
    keywords = []
    
    # 기본 키워드 패턴
    patterns = {
        '범죄': ['흉기', '난동', '폭력', '협박', '체포', '검거', '수사'],
        '음주': ['만취', '술', '음주', '알코올'],
        '장소': ['노상', '길거리', '도로', '공공장소', '구로구', '서울'],
        '법적': ['불구속', '송치', '혐의', '기소', '판결']
    }
    
    situation_lower = situation.lower()
    
    for category, terms in patterns.items():
        for term in terms:
            if term in situation_lower:
                keywords.append(term)
    
    return keywords

def search_similar_cases(situation):
    """CSV 데이터에서 유사 사건 검색"""
    try:
        keywords = extract_keywords(situation)
        similar_cases = []
        
        # CSV 파일들 탐색
        csv_files = ['accident.csv', 'law.csv', 'health.csv', 'education.csv', 
                    'welfare.csv', 'traffic.csv', 'region.csv', 'environment.csv']
        
        for csv_file in csv_files:
            file_path = os.path.join(DATA_DIR, csv_file)
            
            if os.path.exists(file_path):
                try:
                    df = pd.read_csv(file_path)
                    
                    # 기사 제목과 본문에서 키워드 검색
                    if 'title' in df.columns and 'body_prep' in df.columns:
                        for _, row in df.iterrows():
                            title = str(row.get('title', ''))
                            body = str(row.get('body_prep', ''))
                            
                            # 키워드 매칭 확인
                            match_count = 0
                            for keyword in keywords:
                                if keyword in title.lower() or keyword in body.lower():
                                    match_count += 1
                            
                            # 2개 이상 키워드가 매칭되면 유사 사건으로 간주
                            if match_count >= 2:
                                similar_cases.append({
                                    'date': row.get('date', '날짜 불명'),
                                    'title': title[:100] + '...' if len(title) > 100 else title,
                                    'summary': body[:200] + '...' if len(body) > 200 else body,
                                    'source': csv_file
                                })
                            
                            # 최대 5개까지만 수집
                            if len(similar_cases) >= 5:
                                break
                                
                except Exception as e:
                    print(f"Error reading {csv_file}: {e}")
                    continue
                    
            if len(similar_cases) >= 5:
                break
        
        return similar_cases[:5]  # 최대 5개 반환
        
    except Exception as e:
        print(f"Error in search_similar_cases: {e}")
        return []

def get_statistics_summary():
    """데이터 전체 통계 요약"""
    try:
        stats = {}
        csv_files = ['accident.csv', 'law.csv', 'health.csv', 'education.csv', 
                    'welfare.csv', 'traffic.csv', 'region.csv', 'environment.csv']
        
        for csv_file in csv_files:
            file_path = os.path.join(DATA_DIR, csv_file)
            
            if os.path.exists(file_path):
                try:
                    df = pd.read_csv(file_path)
                    stats[csv_file] = {
                        'count': len(df),
                        'categories': csv_file.replace('.csv', '')
                    }
                except Exception as e:
                    print(f"Error reading {csv_file}: {e}")
                    continue
        
        return stats
        
    except Exception as e:
        print(f"Error in get_statistics_summary: {e}")
        return {} 