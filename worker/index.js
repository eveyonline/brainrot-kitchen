export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/recipes' && request.method === 'POST') {
      return handleRecipes(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleRecipes(request, env) {
  if (!env.GEMINI_API_KEY) {
    return Response.json(
      { error: 'Missing GEMINI_API_KEY secret' },
      { status: 500 }
    );
  }

  const { prompt } = await request.json();

  if (!prompt) {
    return Response.json(
      { error: 'Missing prompt' },
      { status: 400 }
    );
  }

  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    return Response.json(
      { error: `Gemini API ${geminiRes.status}` },
      { status: 502 }
    );
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    return Response.json(
      { error: 'Empty Gemini response' },
      { status: 502 }
    );
  }

  const clean = text.replace(/```json|```/g, '').trim();
  const meals = JSON.parse(clean);

  return Response.json(meals);
}