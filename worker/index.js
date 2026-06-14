export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/recipes' && request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

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
      { 
        status: 502,
        headers: corsHeaders(), 
      }

    );
  }

  const { prompt } = await request.json();

  if (!prompt) {
    return Response.json(
      { error: 'Missing prompt' },
      { 
        status: 400,
        headers: corsHeaders(request), 
      }
    );
  }

  const acceptLanguage = request.headers.get('Accept-Language') || 'fr-FR';

  const finalPrompt = `
    ${prompt}

    Contrainte supplémentaire importante :
    - Réponds dans la langue préférée de l'utilisateur.
    - Langue préférée détectée : ${acceptLanguage}
    - Si la langue n'est pas claire, réponds en français.
    - Garde exactement le format JSON demandé.
    - Ne traduis jamais les clés JSON.
    - Traduis uniquement les valeurs affichées à l'utilisateur : titres, descriptions, ingrédients et étapes.
    - Ne mets aucun texte avant ou après le JSON.
  `;

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
            parts: [{ text: finalPrompt }],
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
      {
        status: 502,
        headers: corsHeaders(request),
      }
    );
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    return Response.json(
      { error: 'Empty Gemini response' },
      { 
        status: 502,
        headers: corsHeaders(request),
      }
    );
  }

  const clean = text.replace(/```json|```/g, '').trim();
  let meals;

  try {
    meals = JSON.parse(clean);
  } catch (error) {
    return Response.json(
      { error: 'Invalid Gemini JSON response' },
      {
        status: 502,
        headers: corsHeaders(request),
      }
    );
  }

  return Response.json(meals, {
    headers: corsHeaders(request),
  });
}

function corsHeaders(request) {
  const allowedOrigins = [
    'https://eveyonline.github.io',
    'http://localhost:8000',
  ];

  const origin = request.headers.get('Origin');

  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
      ? origin
      : 'https://eveyonline.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
