# 🎒 WeRoad Copilot — Augmented Travel Diary (Concept & PoC)

> **A Proof of Concept (PoC) designed from the on-the-ground Coordinator experience.**  
> Proposing the next step for WeRoad's AI toolkit: enriching the day-by-day Travel Diary structure with community Telegram insights, complete with clear source attribution.

---

## 📌 Context: Proposal & Objective

This repository is a **working prototype / technical proposal** submitted to showcase how WeRoad's current internal AI tools could evolve into an end-to-end, itinerary-centric assistant.

WeRoad already offers an internal AI assistant where Coordinators can query official Travel Diaries and curated Tips. However, in day-to-day route preparation, two operational gaps remain:

1. **Information lives in prompts instead of the timeline:**  
   Coordinators still have to think of what questions to ask in an isolated chat window and then manually paste or relate that information back into the day-by-day plan.  
   * **The Proposal:** Embed collective intelligence directly into the native timeline/itinerary view (Day 1, Day 2, Day 3...) so coordinators see community wisdom mapped against official stops automatically.

2. **Telegram community data is missing from the loop:**  
   The freshest, most critical updates (road status, ATM alerts, driver contacts, seasonal nuances) live in route-specific Telegram chats.  
   Because automatic background access to private Telegram channels presents technical and privacy bottlenecks, this proposal explores a practical alternative: **allowing coordinators to export and upload their route chat file into the tool**.

---

## 🧭 Key Concepts Demonstrated in this Prototype

* 🗺️ **Augmented Itinerary View:**  
  Demonstrates how LLM-driven retrieval can organize unstructured notes around existing travel diary milestones.
* 🏷️ **Traceability & Source Badging:**  
  Ensures every recommendation shows its exact origin:
  * `[Official: Travel Diary]`
  * `[Curated: Tips Document]`
  * `[Community: Telegram Chat]`
* 📥 **Telegram Export Ingestion (PoC Mode vs. Production Vision):**  
  * **Current Prototype Behavior:** To provide an immediate, zero-friction demonstration without requiring the reviewer to supply their own files, the app comes with a pre-loaded sample export (`data/telegram_chat.json`). If the upload zone is left empty, the engine automatically falls back to this bundled route sample to enrich the itinerary. However, an interactive upload box is provided to test uploading custom `.json` or `.txt` chat exports.
  * **Production Target:** In the final production deployment, there will be no bundled fallback file. Coordinators will simply have an upload zone to drag-and-drop their own exported route chat whenever preparing an assigned trip.
* 📄 **Download PDF Button (UI Mockup Notice):**  
  The *"Download Travel Diary"* button in the top navigation is currently a **visual mockup** intended to illustrate the end-user workflow (offline export). It is not functional in this prototype.
* 🔍 **Contextual Q&A:**  
  Allows quick semantic search over all three integrated data layers simultaneously.

---

## 🛠 Prototype Architecture

* **Frontend:**
  * [React](https://react.dev/) + [Vite](https://vitejs.dev/) mock interface demonstrating how community intelligence overlays the official itinerary.
  * Interactive file uploader component with instant fallback preview for demo purposes.
* **Backend & RAG Engine:**
  * [Python](https://www.python.org/) + [ChromaDB](https://www.trychroma.com/) vector store.
  * Ingestion logic designed to handle heterogeneous travel sources:
    * `travel_diary.pdf` (official baseline)
    * `tips.txt` (curated knowledge base)
    * `telegram_chat.json` (route community export / fallback sample)

---

## 📂 Project Structure

```text
weroad-copilot/
├── data/
│   ├── travel_diary.pdf      # Sample official WeRoad itinerary
│   ├── tips.txt              # Sample coordinator tips
│   └── telegram_chat.json    # Pre-loaded sample Telegram chat (fallback for demo)
├── frontend/                 # React UI prototype
│   ├── src/
│   │   ├── App.jsx           # Main UI with Itinerary & Chat Uploader
│   │   ├── services/aiService.js
│   │   └── ...
│   └── package.json
├── main.py                   # FastAPI service (fallback handling & Groq integration)
├── rag_engine.py             # RAG engine (chunking, embeddings & sources)
└── README.md
```

---

## 🚀 Running

### Prerequisites
* Node.js (v18+)
* Python 3.10+
* Groq API Key (free tier available at [console.groq.com](https://console.groq.com))

### 1. Run Backend Service
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Set GROQ_API_KEY in .env

# Start server
python main.py
```

### 2. Run Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the prototype.

---

## 💡 Potential Roadmap for Production Integration

* **Dedicated Importer Screen:** Remove the demo sample fallback and provide a simple 1-click modal guiding coordinators on how to export their Telegram chat from Telegram Desktop.
* **Granular Source Filters:** Allow coordinators to toggle visibility between official guidelines and unofficial community hacks.
* **Functional Export to Annotated PDF / Offline Mode:** Implement the active generation for the *"Download Travel Diary"* feature to produce field-ready itinerary PDFs with peer notes embedded in margin callouts for remote travel legs with limited cell service.

---

*Conceived as a contribution to the WeRoad Coordinator workflow by a passionate Coordinator & Developer.*