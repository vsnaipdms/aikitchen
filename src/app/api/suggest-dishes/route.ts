import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

function extractJSON(text: string): string | null {
  const start = text.search(/[{[]/);
  if (start === -1) return null;
  let end = text.lastIndexOf("}") + 1;
  if (end === 0) end = text.lastIndexOf("]") + 1;
  if (end <= start) return null;
  const cleaned = text.slice(start, end);
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  return jsonMatch ? jsonMatch[1] : cleaned;
}

async function callGroq(messages: { role: string; content: string }[], maxTokens: number) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Groq error:", res.status, text);
    return NextResponse.json({ error: `Groq API error (${res.status})` }, { status: 502 });
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Empty response from Groq" }, { status: 502 });
  }

  return { content };
}

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    if (!ingredients?.length) {
      return NextResponse.json({ error: "Add at least one ingredient" }, { status: 400 });
    }

    const prompt = `Suggest 6 dishes the user can make with: ${ingredients.join(", ")}. Each dish must be a well-known real recipe.

CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no extra text.
{
  "dishes": [
    {
      "id": "dish-1",
      "name": "Dish Name",
      "description": "Short enticing description (max 15 words)",
      "cookingTime": "e.g. 25 mins",
      "difficulty": "Easy or Medium or Hard",
      "cuisine": "e.g. Indian, Italian, Chinese, Mexican, etc",
      "isVeg": true or false
    }
  ]
}`;

    const result = await callGroq(
      [
        { role: "system", content: "You are a helpful chef assistant. Always respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      1500
    );

    if (result instanceof NextResponse) return result;

    const jsonStr = extractJSON(result.content);
    if (!jsonStr) {
      console.error("Could not extract JSON from:", result.content);
      return NextResponse.json({ error: "Failed to parse suggestions" }, { status: 502 });
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch {
      console.error("JSON parse error. Raw:", jsonStr);
      return NextResponse.json({ error: "Invalid suggestions format" }, { status: 502 });
    }
  } catch (error) {
    console.error("suggest-dishes error:", error);
    return NextResponse.json({ error: "Failed to suggest dishes" }, { status: 500 });
  }
}
