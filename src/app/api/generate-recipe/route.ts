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
    const { dishName, ingredients } = await request.json();
    if (!dishName) {
      return NextResponse.json({ error: "Dish name required" }, { status: 400 });
    }

    const prompt = `You are a professional chef. Generate a detailed recipe for "${dishName}" using these ingredients: ${(ingredients ?? []).join(", ")}. You may suggest up to 5 extra ingredients if needed.

CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no extra text.
{
  "recipe": {
    "dishName": "${dishName}",
    "ingredients": ["list all ingredients needed"],
    "servings": 4,
    "cookingTime": "e.g. 45 mins",
    "difficulty": "Easy or Medium or Hard",
    "cuisine": "e.g. Indian, Italian, etc",
    "isVeg": true or false,
    "prepSteps": ["Step 1", "Step 2", "Step 3"],
    "cookSteps": ["Step 1", "Step 2", "Step 3"],
    "tips": ["Tip 1", "Tip 2"],
    "extraIngredients": ["extra item 1", "extra item 2"]
  }
}`;

    const result = await callGroq(
      [
        { role: "system", content: "You are a helpful chef assistant. Always respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      3000
    );

    if (result instanceof NextResponse) return result;

    const jsonStr = extractJSON(result.content);
    if (!jsonStr) {
      console.error("Could not extract JSON from:", result.content);
      return NextResponse.json({ error: "Failed to parse recipe" }, { status: 502 });
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch {
      console.error("JSON parse error. Raw:", jsonStr);
      return NextResponse.json({ error: "Invalid recipe format" }, { status: 502 });
    }
  } catch (error) {
    console.error("generate-recipe error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
