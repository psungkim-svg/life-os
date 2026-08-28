export const INITIAL_SAMPLE_MEMORIES = [
  {
    id: 'sample-1',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    content: '나중에 아내랑 일본 여행 갈 때 교토 청수사랑 아라시야마를 꼭 가보고 싶다.',
    category: 'Travel',
    type: 'thought',
    tags: ['여행', '교토', '가족여행'],
    source: 'voice',
    is_actionable: false,
    is_completed: false,
    importance: 4
  },
  {
    id: 'sample-2',
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    content: '투자용 상가 건물의 임대 수익률 분석표 다듬어보고 6개월 후 재점검하기.',
    category: 'Investing',
    type: 'decision',
    tags: ['투자', '부동산', '임대수익'],
    source: 'text',
    is_actionable: true,
    is_completed: false,
    due_date: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
    importance: 5
  },
  {
    id: 'sample-3',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    content: '오늘의 묵상: 시편 23편 1절 - 여호와는 나의 목자시니 내게 부족함이 없으리로다.',
    category: 'Faith',
    type: 'faith',
    tags: ['성경', '묵상', '시편'],
    source: 'text',
    is_actionable: false,
    is_completed: false,
    importance: 5
  },
  {
    id: 'sample-4',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    content: '우리집 가스보일러 겨울 대비 안전점검 및 필터 교체 신청하기.',
    category: 'Home',
    type: 'task',
    tags: ['집관리', '보일러', '점검'],
    source: 'voice',
    is_actionable: true,
    is_completed: false,
    due_date: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
    importance: 3
  },
  {
    id: 'sample-5',
    created_at: new Date().toISOString(),
    content: '아내와 함께 쓸 생활비 공유 구글 시트 양식 검토 및 앱 연동 테스트.',
    category: 'Family',
    type: 'task',
    tags: ['가족', '생활비', '앱연동'],
    source: 'text',
    is_actionable: true,
    is_completed: true,
    importance: 4
  }
];
