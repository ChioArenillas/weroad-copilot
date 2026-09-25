import json
import os
import traceback
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel

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

        prompt = f"""
        You are an expert WeRoad Trip Coordinator and Travel Operations Specialist.
        Analyze the following trip itinerary:
        {json.dumps(req.travel_diary_base, ensure_ascii=False)}

        TASK:
        1. GENERAL INFO: Generate overall trip tips for general travel logistics (e.g. Visa requirements, Currency & Payments, Local SIM card/connectivity, Packing list, Health & Safety).
        2. DAILY ITINERARY: For every day in the itinerary, generate practical, realistic recommendations:
           - "telegram": Urgent/logistical group chat announcement (meeting times, dress codes, cash requirements, transport info).
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
              "text": "Sri Lanka uses LKR. It is recommended to carry cash for local markets and jeep safaris."
            }},
            {{
              "category": "Visas & Entry",
              "text": "Ensure your ETA visa for Sri Lanka is applied for online before arrival."
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