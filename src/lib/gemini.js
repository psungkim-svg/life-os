export const getGeminiKey = () => {
  return localStorage.getItem('LIFEOS_GEMINI_KEY') || '';
};

export const saveGeminiKey = (key) => {
  localStorage.setItem('LIFEOS_GEMINI_KEY', key.trim());
};

// Analyze new memory using Gemini REST API
export const analyzeMemoryWithGemini = async (text, apiKey) => {
  const key = apiKey || getGeminiKey();
  if (!key) {
    // Fallback if no key provided
    return {
      content: text,
      category: 'General',
      type: 'thought',
      tags: ['메모'],
      is_actionable: false,
      importance: 3
    };
  }

  const prompt = `
당신은 개인 인생 운영체제(Life OS)의 AI 두뇌입니다.
사용자가 입력한 아래 메모/생각을 분석하여 반드시 유효한 JSON 형식으로만 응답하세요.

[분석할 입력]
"${text}"

[JSON 응답 포맷]
{
  "content": "가독성 있게 다듬은 정돈된 텍스트",
  "category": "Home(집관리) | Family(가족) | Travel(여행) | Investing(재무/투자) | Faith(신앙) | Health(건강) | General(기타) 중 하나",
  "type": "thought(생각) | task(할일) | event(일정) | decision(결정) | financial(재무) | faith(신앙) 중 하나",
  "tags": ["키워드태그1", "키워드태그2"],
  "is_actionable": true 또는 false (해야 할 일이면 true),
  "due_date": "YYYY-MM-DD" (날짜나 기한이 언급된 경우만 ISO 문자열, 없으면 null),
  "importance": 1~5 사이의 정수 (중요도, 기본값 3)
}
`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.status}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText);
    }
  } catch (err) {
    console.warn("Gemini REST API analyze fallback:", err);
  }

  // Fallback
  return {
    content: text,
    category: 'General',
    type: text.includes('까지') || text.includes('하자') || text.includes('사야') ? 'task' : 'thought',
    tags: ['메모'],
    is_actionable: text.includes('까지') || text.includes('하자') || text.includes('사야'),
    importance: 3
  };
};

// Query Second Brain
export const askSecondBrain = async (query, memories, apiKey) => {
  const key = apiKey || getGeminiKey();
  if (!key) {
    return "Gemini API Key를 설정하시면 AI가 저장된 기억을 분석해 답변해 드립니다!";
  }

  const memoryContext = memories.map((m, i) => 
    `[기록 ${i+1}] 날짜: ${new Date(m.created_at).toLocaleDateString('ko-KR')} | 카테고리: ${m.category} | 유형: ${m.type} | 내용: ${m.content}`
  ).join("\n");

  const prompt = `
당신은 김부장님의 '외장 두뇌(Second Brain)' AI 비서입니다.
아래는 김부장님이 평소 기록해둔 인생 데이터와 메모 목록입니다.

[저장된 기억 목록]
${memoryContext || "아직 저장된 기록이 없습니다."}

[김부장님의 질문]
"${query}"

[지침]
1. 저장된 기억을 바탕으로 따뜻하고 친절하게 김부장님의 질문에 답하세요.
2. 관련 기록이 있으면 몇 월 몇 일에 무슨 내용으로 기록했는지 짚어주세요.
3. 관련 기록이 전혀 없더라도 친절하게 안내하세요.
`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성하지 못했습니다.";
  } catch (err) {
    return `AI 외장 두뇌 호출 중 오류가 발생했습니다: ${err.message}`;
  }
};
