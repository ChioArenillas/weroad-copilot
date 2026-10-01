import { DaySchedule, ProcessedAIUpdates, AIEnrichmentResponse, AIEnrichmentPayload } from '../types';

const API_BASE_URL: string = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface GenerateEnhancementsParams {
  itinerary: DaySchedule[];
  telegram_chat?: string;
}

export async function generateAIEnhancements({
  itinerary,
  telegram_chat = ""
}: GenerateEnhancementsParams): Promise<ProcessedAIUpdates> {
  const payload: AIEnrichmentPayload = {
    travel_diary_base: itinerary,
    telegram_chat,
    new_tips: ""
  };

  const response = await fetch(`${API_BASE_URL}/api/enrich-itinerary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: `HTTP error ${response.status}` }));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  const data: AIEnrichmentResponse = await response.json();

  const generalInfoUpdates = (data.generalInfoUpdates || []).map((item, index) => ({
    id: item.id || `gen-info-${Date.now()}-${index}`,
    text: item.text,
    source: item.source || 'tip'
  }));

  const itineraryUpdates = (data.injections || []).map((item, index) => ({
    ...item,
    id: item.id || `ai-gen-${Date.now()}-${index}`
  }));

  return {
    generalInfoUpdates,
    itineraryUpdates
  };
}