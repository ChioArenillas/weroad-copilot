export async function generateAIEnhancements({ itinerary, telegram_chat = "" }) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/enrich-itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        travel_diary_base: itinerary,
        telegram_chat: telegram_chat || "",
        new_tips: "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();

    const generalInfoUpdates = (data.generalInfoUpdates || []).map((item, index) => ({
      ...item,
      id: item.id || `gen-info-${Date.now()}-${index}`,
    }));

    const itineraryUpdates = (data.injections || []).map((item, index) => ({
      ...item,
      id: item.id || `ai-gen-${Date.now()}-${index}`,
    }));

    return {
      generalInfoUpdates,
      itineraryUpdates,
    };
  } catch (error) {
    console.error("Error connecting to backend API:", error);
    throw error;
  }
}