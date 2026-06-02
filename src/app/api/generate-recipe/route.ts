import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

function getPrompt(dishName: string, ingredients: string[]) {
  return `You are a chef. Generate a detailed recipe for "${dishName}" using: ${ingredients.join(", ")}. You may suggest up to 5 extra ingredients.

Return ONLY valid JSON:
{
  "recipe": {
    "dishName": "${dishName}",
    "ingredients": ["list of ingredients"],
    "servings": 4,
    "cookingTime": "45 mins",
    "difficulty": "Easy|Medium|Hard",
    "cuisine": "Italian",
    "isVeg": true,
    "prepSteps": ["Step 1", "Step 2"],
    "cookSteps": ["Step 1", "Step 2"],
    "tips": ["Tip 1"],
    "extraIngredients": ["extra item 1"]
  }
}`;
}

export async function POST(request: Request) {
  try {
    const { dishName, ingredients } = await request.json();
    if (!dishName) {
      return NextResponse.json({ error: "Dish name required" }, { status: 400 });
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
          { role: "system", content: getPrompt(dishName, ingredients ?? []) },
          { role: "user", content: `Recipe for ${dishName}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
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
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
