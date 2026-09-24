import json
import os
import traceback
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
  telegram_chat: str
  new_tips: str


@app.post("/api/enrich-itinerary")
async def enrich_itinerary(req: EnrichmentRequest):
  try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
        Eres un asistente de operaciones para coordinadores de WeRoad.
        Tienes un itinerario base oficial:
        {json.dumps(req.travel_diary_base, ensure_ascii=False)}

        Nuevas fuentes de información informal:
        - MENSAJES DE TELEGRAM: {req.telegram_chat}
        - TIPS Y NOTAS DE VIAJE: {req.new_tips}

        TAREA:
        1. Analiza los mensajes de Telegram y las Tips.
        2. Extrae SOLO información logística clave, avisos de última hora o consejos prácticos.
        3. Identifica a qué día del itinerario ("day") corresponde cada dato.
        4. Etiqueta el origen exacto ("telegram" o "tip").

        Responde ÚNICAMENTE en formato JSON válido con esta estructura estricta:
        {{
          "injections": [
            {{ "day": 1, "text": "Quedada a las 20:00 en la recepción del hotel", "source": "telegram" }},
            {{ "day": 1, "text": "Comprar tarjeta SIM en la terminal de llegadas", "source": "tip" }}
          ]
        }}
        """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)

  except Exception as e:
    traceback.print_exc()
    raise HTTPException(status_code=500, detail=str(e))