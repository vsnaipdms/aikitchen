import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

function getPrompt(ingredients: string[]) {
  return `You are a chef. Suggest 6 dishes the user can make with: ${ingredients.join(", ")}.
Return ONLY valid JSON:
{
  "dishes": [
    {
      "id": "dish-1",
      "name": "Dish Name",
      "description": "Short description",
      "cookingTime": "25 mins",
      "difficulty": "Easy|Medium|Hard",
      "cuisine": "Italian|Indian|Chinese|Mexican|Japanese|American|Thai|French|etc",
      "isVeg": true
    }
  ]
}`;
}

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    if (!ingredients?.length) {
      return NextResponse.json({ error: "Add at least one ingredient" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not set in .env.local" }, { status: 500 });
    }

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: getPrompt(ingredients) },
          { role: "user", content: `What can I cook with ${ingredients.join(", ")}?` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Groq error response:", text);
      return NextResponse.json({ error: `Groq API error (${res.status}): ${text}` }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "No response from Groq" }, { status: 502 });

    const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: "Failed to suggest dishes" }, { status: 500 });
  }
}
