import json
import os
import traceback
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="WeRoad Co-Pilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnrichmentRequest(BaseModel):
    travel_diary_base: list
    telegram_chat: Optional[str] = ""
    new_tips: Optional[str] = ""

@app.post("/api/enrich-itinerary")
async def enrich_itinerary(req: EnrichmentRequest):
    try:
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

        client = Groq(api_key=api_key)

        chat_content = req.telegram_chat.strip() if req.telegram_chat else ""
        if not chat_content:
            sample_chat_path = os.path.join(os.path.dirname(__file__), "data", "telegram_chat.json")
            if os.path.exists(sample_chat_path):
                with open(sample_chat_path, "r", encoding="utf-8") as f:
                    try:
                        parsed = json.load(f)
                        messages = (parsed.get("messages") or [])
                        chat_content = "\n".join([
                            f"[{m.get('date', '')}] {m.get('from', '')}: {m.get('text', '')}"
                            for m in messages if m.get("type") == "message" and isinstance(m.get("text"), str)
                        ][-250:])
                    except Exception:
                        chat_content = ""

        telegram_context = ""
        if chat_content:
            telegram_context = f"""
            REAL TELEGRAM CHAT HISTORY (COMMUNITY OF WE-ROAD COORDINATORS):
            \"\"\"{chat_content[:10000]}\"\"\"
            Extract actual group alerts, logistics recommendations, cash warnings, and local tips from the chat history above.
            """

        prompt = f"""
        You are an expert WeRoad Trip Coordinator and Travel Operations Specialist.
        Analyze the following trip itinerary:
        {json.dumps(req.travel_diary_base, ensure_ascii=False)}

        {telegram_context}

        TASK:
        1. GENERAL INFO: Generate overall trip tips for general travel logistics (e.g. Visa requirements, Currency & Payments, Local SIM card/connectivity, Packing list, Health & Safety).
        2. DAILY ITINERARY: For every day in the itinerary, generate practical, realistic recommendations:
           - "telegram": Urgent/logistical group chat announcement (meeting times, dress codes, cash requirements, transport info) anchored in the telegram history if relevant.
           - "tip": Useful local recommendation (local food to try, photo spots, safety tips, cultural etiquette).

        RULES:
        - Generate AT LEAST 4-5 key general information points in "generalInfoUpdates".
        - Generate AT LEAST 2 daily items per day in "injections" (one "telegram" and one "tip").
        - Write all generated content strictly in clear English.

        Return STRICTLY a valid JSON object in this exact format:
        {{
          "generalInfoUpdates": [
            {{
              "category": "Currency & Payments",
              "text": "..."
            }}
          ],
          "injections": [
            {{
              "day": 1,
              "text": "Generated telegram alert here...",
              "source": "telegram"
            }},
            {{
              "day": 1,
              "text": "Generated practical tip here...",
              "source": "tip"
            }}
          ]
        }}
        """

        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"},
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)