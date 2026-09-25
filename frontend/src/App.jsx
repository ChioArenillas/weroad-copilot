import React, { useState } from 'react';
import { Sparkles, Bed, Utensils, Download, AlertCircle, Phone, CreditCard, ShieldCheck } from 'lucide-react';
import { generateAIEnhancements } from './services/aiService';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('ITINERARY');
  const [loadingEnrich, setLoadingEnrich] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // 1. GENERAL INFORMATION STATE
  const [generalInfo, setGeneralInfo] = useState([
    {
      categoryKey: "visa",
      title: "Requirements & Visa (ETA)",
      icon: <ShieldCheck size={18} />,
      items: [
        { id: "g1-1", text: "Sri Lanka ETA: Free of charge starting May 25, 2026 for Spanish and Italian citizens (apply via official portal only).", source: "travel_diary" },
        { id: "g1-2", text: "Maldives: IMUGA Traveller Declaration form mandatory prior to boarding.", source: "travel_diary" },
        { id: "g1-3", text: "Vaccinations: Yellow Fever Certificate required only if traveling from endemic areas.", source: "travel_diary" }
      ]
    },
    {
      categoryKey: "contacts",
      title: "Local Partners & Emergency Contacts",
      icon: <Phone size={18} />,
      items: [
        { id: "g2-1", text: "Sri Lanka: Wanderlust Asia (+94 77 706 7295) — Contact only for voucher discrepancies or actual emergencies starting 3 days prior to arrival.", source: "travel_diary" },
        { id: "g2-2", text: "Maldives: Giorgia Atripaldi (Maldives Fellas: +39 339 6351542) / ShadowPalm (+960 9960109) / Alba (+39 340 864 7210).", source: "travel_diary" },
        { id: "g2-3", text: "Maafushi Accommodation Contact: Triton Hotel Manager Malithi (+960 7629991).", source: "travel_diary" }
      ]
    },
    {
      categoryKey: "budget",
      title: "Budget & Group Fund",
      icon: <CreditCard size={18} />,
      items: [
        { id: "g3-1", text: "Sri Lanka Group Kitty: Approx. €200 per person for shared entrance fees and group transportation.", source: "travel_diary" },
        { id: "g3-2", text: "Meals: Average €7 to €10 per lunch/dinner.", source: "travel_diary" },
        { id: "g3-3", text: "Maldives: Excursions are 100% optional and paid individually (USD and EUR cash accepted).", source: "travel_diary" }
      ]
    },
    {
      categoryKey: "packing",
      title: "Packing List & Essentials",
      icon: <AlertCircle size={18} />,
      items: [
        { id: "g4-1", text: "Temples: Shoulders and knees must be covered (bring a sarong or long trousers).", source: "travel_diary" },
        { id: "g4-2", text: "Temple Socks: Stone floors heat up significantly during midday sun.", source: "travel_diary" },
        { id: "g4-3", text: "Power Adapter: Type BS546 (commonly used across Sri Lanka).", source: "travel_diary" },
        { id: "g4-4", text: "Health: High-strength mosquito repellent (Dengue prophylaxis).", source: "travel_diary" }
      ]
    }
  ]);

  // 2. DAY-BY-DAY ITINERARY STATE
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      date: "Saturday",
      title: "Negombo",
      hotel: "Hotel in Negombo",
      meal: "Night",
      items: [
        { id: "d1-1", text: "Airport arrival and transfer to hotel in Negombo.", source: "travel_diary" },
        { id: "d1-2", text: "Welcome briefing with local partner (Wanderlust Asia) in the hotel lobby.", source: "travel_diary" },
        { id: "d1-3", text: "Recommended dinner spots: Lords Restaurant, Tuk Tuk Restaurant, or Sea View Restaurant.", source: "travel_diary" }
      ]
    },
    {
      day: 2,
      date: "Sunday",
      title: "Anuradhapura",
      hotel: "Hotel in Anuradhapura",
      meal: "Night + Breakfast",
      items: [
        { id: "d2-1", text: "Private van transfer from Negombo to Anuradhapura (approx. 5 hours).", source: "travel_diary" },
        { id: "d2-2", text: "Guided tour of the ancient sacred city of Anuradhapura (approx. 6000-8000 LKR + tip).", source: "travel_diary" },
        { id: "d2-3", text: "Recommended sunset visit to Mihintale complex.", source: "travel_diary" }
      ]
    },
    {
      day: 3,
      date: "Monday",
      title: "Minneriya National Park & Sigiriya",
      hotel: "Hotel in Sigiriya",
      meal: "Night + Breakfast + Lunch",
      items: [
        { id: "d3-1", text: "Early departure (07:30 AM) to avoid peak daytime heat.", source: "travel_diary" },
        { id: "d3-2", text: "4x4 Jeep Safari in Minneriya National Park or Hurulu Eco Park for wild elephant gathering (~$50 USD).", source: "travel_diary" },
        { id: "d3-3", text: "Traditional village lunch experience (included in program).", source: "travel_diary" },
        { id: "d3-4", text: "Climb the Sigiriya Lion Rock Fortress (entrance fee approx. $35 USD).", source: "travel_diary" }
      ]
    },
    {
      day: 4,
      date: "Tuesday",
      title: "Road to Kandy",
      hotel: "Hotel in Kandy",
      meal: "Night + Breakfast",
      items: [
        { id: "d4-1", text: "Sunrise climb at Pidurangala Rock (1000 LKR fee) with direct panoramic views of Sigiriya.", source: "travel_diary" },
        { id: "d4-2", text: "Photo stop at the Golden Buddha and visit to Dambulla Cave Temple (~$10 USD).", source: "travel_diary" },
        { id: "d4-3", text: "En-route visit to a local Herbal & Spice Garden including lunch.", source: "travel_diary" },
        { id: "d4-4", text: "Evening ceremony at the Temple of the Sacred Tooth Relic in Kandy (2000 LKR fee).", source: "travel_diary" }
      ]
    },
    {
      day: 5,
      date: "Wednesday",
      title: "Kandy to Ella",
      hotel: "Hotel in Ella",
      meal: "Night + Breakfast",
      items: [
        { id: "d5-1", text: "Optional stop at Ambuluwawa Tower (not recommended for those afraid of heights).", source: "travel_diary" },
        { id: "d5-2", text: "Visit to Nuwara Eliya tea plantations and manufacturing factory.", source: "travel_diary" },
        { id: "d5-3", text: "Scenic train journey from Nanu Oya (Nuwara Eliya) to Ella (3-hour ride).", source: "travel_diary" },
        { id: "d5-4", text: "Dinner in Ella town (Cafe Chill, Rocky Ella, or Roti Hut).", source: "travel_diary" }
      ]
    },
    {
      day: 6,
      date: "Thursday",
      title: "Ella",
      hotel: "Hotel in Ella",
      meal: "Night + Breakfast",
      items: [
        { id: "d6-1", text: "Sunrise hike to Little Adam's Peak (easy, 30 min) or Ella Rock (challenging 2-hour hike).", source: "travel_diary" },
        { id: "d6-2", text: "Nine Arches Bridge viewpoint for the train passage (~11:30 AM - 12:00 PM).", source: "travel_diary" },
        { id: "d6-3", text: "Optional adventure: Flying Ravana Mega Zipline (9600 LKR).", source: "travel_diary" }
      ]
    },
    {
      day: 7,
      date: "Friday",
      title: "Rafting & Road to Colombo",
      hotel: "Hotel in Colombo",
      meal: "Night + Breakfast",
      items: [
        { id: "d7-1", text: "Westbound transfer with a stop in Kitulgala.", source: "travel_diary" },
        { id: "d7-2", text: "White water rafting adventure on the Kelani River in Kitulgala (included with Wanderlust Asia).", source: "travel_diary" },
        { id: "d7-3", text: "Arrival and overnight hotel stay in Colombo.", source: "travel_diary" }
      ]
    },
    {
      day: 8,
      date: "Saturday",
      title: "Flight to Maldives & Speedboat to Maafushi",
      hotel: "Triton Hotel (Maafushi)",
      meal: "Night",
      items: [
        { id: "d8-1", text: "Transfer to Colombo Airport and flight to Malé (included).", source: "travel_diary" },
        { id: "d8-2", text: "Mandatory gratuity collection for Sri Lanka driver & guide (minimum €5/person each).", source: "travel_diary" },
        { id: "d8-3", text: "Meet WeRoad representative in Malé and board the express speedboat to Maafushi.", source: "travel_diary" },
        { id: "d8-4", text: "Check-in at Maafushi island hotel (Triton Beach / Exotica / Prestige).", source: "travel_diary" }
      ]
    },
    {
      day: 9,
      date: "Sunday",
      title: "Maafushi • Optional Excursions",
      hotel: "Triton Hotel (Maafushi)",
      meal: "Night + Breakfast",
      items: [
        { id: "d9-1", text: "Free day to relax at Bikini Beach.", source: "travel_diary" },
        { id: "d9-2", text: "Optional excursion with Alba / ShadowPalm: Snorkeling with Nurse Sharks & Stingrays (~$60-$80 USD).", source: "travel_diary" },
        { id: "d9-3", text: "Discover Scuba Diving session with Dive Squad (~$75 USD).", source: "travel_diary" }
      ]
    },
    {
      day: 10,
      date: "Monday",
      title: "Maafushi • Shark Bay / Gulhi Island",
      hotel: "Triton Hotel (Maafushi)",
      meal: "Night + Breakfast",
      items: [
        { id: "d10-1", text: "Optional Whale Shark excursion (~$100 - $110 USD).", source: "travel_diary" },
        { id: "d10-2", text: "Optional full day visit to neighboring local island Gulhi (transfer + lunch ~$25-$30 USD).", source: "travel_diary" }
      ]
    },
    {
      day: 11,
      date: "Tuesday",
      title: "Maafushi • Resort Day / Farewell BBQ",
      hotel: "Triton Hotel (Maafushi)",
      meal: "Night + Breakfast",
      items: [
        { id: "d11-1", text: "Optional Resort Day Pass (e.g., Olhuveli Resort All-Inclusive ~$125-$130 USD).", source: "travel_diary" },
        { id: "d11-2", text: "Optional farewell beach barbecue with bonfire (~$35-$45 USD).", source: "travel_diary" }
      ]
    },
    {
      day: 12,
      date: "Wednesday",
      title: "Maafushi • Departure & Check-out",
      hotel: "N/A",
      meal: "Breakfast",
      items: [
        { id: "d12-1", text: "Hotel check-out. Official tour services conclude.", source: "travel_diary" },
        { id: "d12-2", text: "Return speedboat transfer to Malé Airport is not included (book 3-4 days prior via Icom Tours for ~$25 USD).", source: "travel_diary" }
      ]
    }
  ]);

  // AI ENRICHMENT HANDLER
const handleAutoSync = async () => {
  if (isSynced || loadingEnrich) return;

  setLoadingEnrich(true);

  try {
    const { generalInfoUpdates, itineraryUpdates } = await generateAIEnhancements({
      itinerary,
    });

    // 1. UPDATE GENERAL INFO SAFELY
    if (generalInfoUpdates && generalInfoUpdates.length > 0) {
      setGeneralInfo((prevInfo) => {
        // Option A: Add new AI items into an "AI Coordinator Tips" section
        const existingAiSectionIndex = prevInfo.findIndex(
          (sec) => sec.categoryKey === "ai_tips"
        );

        if (existingAiSectionIndex !== -1) {
          return prevInfo.map((sec, idx) =>
            idx === existingAiSectionIndex
              ? {
                  ...sec,
                  items: [
                    ...sec.items,
                    ...generalInfoUpdates.map((item) => ({
                      id: item.id,
                      text: item.text,
                      source: item.source || "tip",
                    })),
                  ],
                }
              : sec
          );
        } else {
          // Create the section if it doesn't exist
          return [
            ...prevInfo,
            {
              categoryKey: "ai_tips",
              title: "AI Coordinator Insights & Local Tips",
              icon: <Sparkles size={18} />,
              items: generalInfoUpdates.map((item) => ({
                id: item.id,
                text: item.text,
                source: item.source || "tip",
              })),
            },
          ];
        }
      });
    }

    // 2. UPDATE ITINERARY SAFELY
    if (itineraryUpdates && itineraryUpdates.length > 0) {
      setItinerary((prevItinerary) =>
        prevItinerary.map((dayObj) => {
          const newItemsForDay = itineraryUpdates.filter(
            (newItem) => newItem.day === dayObj.day
          );

          if (newItemsForDay.length === 0) return dayObj;

          return {
            ...dayObj,
            items: [
              ...dayObj.items,
              ...newItemsForDay.map((n) => ({
                id: n.id,
                text: n.text,
                source: n.source || "telegram",
              })),
            ],
          };
        })
      );
    }

    setIsSynced(true);
  } catch (error) {
    console.error("Sync Error:", error);
    alert(`Could not fetch AI recommendations: ${error.message}`);
  } finally {
    setLoadingEnrich(false);
  }
};


  return (
    <div className="app-container">
      {/* Header - WeRoad Style */}
      <div className="weroad-header-card">
        <div className="header-info">
          <h2>Your Travel Diary</h2>
          <p>Sri Lanka & Maldives (SMS) • Download the PDF version to access offline.</p>
        </div>
        <button className="download-pdf-btn">
          <Download size={14} style={{ marginRight: '6px' }} /> Download Travel Diary
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'GENERAL INFO' ? 'active' : ''}`}
          onClick={() => setActiveTab('GENERAL INFO')}
        >
          GENERAL INFO
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ITINERARY' ? 'active' : ''}`}
          onClick={() => setActiveTab('ITINERARY')}
        >
          ITINERARY
        </button>
        <button 
          className={`tab-btn ${activeTab === 'YOUR NOTES' ? 'active' : ''}`}
          onClick={() => setActiveTab('YOUR NOTES')}
        >
          YOUR NOTES
        </button>
      </div>

      {/* ITINERARY TAB */}
      {activeTab === 'ITINERARY' && (
        <div className="itinerary-list">
          <button 
            className={`ai-sync-btn ${isSynced ? 'synced' : ''}`} 
            onClick={handleAutoSync} 
            disabled={loadingEnrich || isSynced}
          >
            <Sparkles size={16} /> 
            {loadingEnrich 
              ? "Syncing with Telegram & Tips..." 
              : isSynced 
                ? "Telegram & Tips Synced" 
                : "Sync Telegram Alerts & Tips"}
          </button>

          {itinerary.map(day => (
            <div key={day.day} className="day-card">
              <div className="day-header-top">Day {day.day} • {day.date}</div>
              <div className="day-header-title">{day.title}</div>
              
              <div className="day-meta">
                <span className="meta-item"><Bed size={15} /> {day.hotel}</span>
                <span className="meta-item"><Utensils size={15} /> {day.meal}</span>
              </div>

              <ul className="day-content-list">
                {day.items.map((item) => (
                  <li key={item.id} className="day-item-row">
                    {item.source !== 'travel_diary' && (
                      <span className={`source-badge ${item.source}`}>
                        {item.source}
                      </span>
                    )}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* GENERAL INFO TAB */}
{activeTab === 'GENERAL INFO' && (
  <div className="general-info-list">
    <button 
      className={`ai-sync-btn ${isSynced ? 'synced' : ''}`} 
      onClick={handleAutoSync} 
      disabled={loadingEnrich || isSynced}
    >
      <Sparkles size={16} /> 
      {loadingEnrich 
        ? "Syncing with Telegram & Tips..." 
        : isSynced 
          ? "Telegram & Tips Synced" 
          : "Sync Telegram Alerts & Tips"}
    </button>

    {generalInfo.map((section) => (
      <div key={section.categoryKey} className="info-card">
        <div className="info-card-header">
          {section.icon}
          <h3>{section.title}</h3>
        </div>
        <ul className="info-card-list">
          {section.items && section.items.map((item) => (
            <li key={item.id} className="info-item-row">
              {item.source !== 'travel_diary' && (
                <span className={`source-badge ${item.source}`}>
                  {item.source}
                </span>
              )}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

      {/* YOUR NOTES TAB */}
      {activeTab === 'YOUR NOTES' && (
        <div className="info-card">
          <div className="info-card-header">
            <h3>Coordinator Notes</h3>
          </div>
          <textarea 
            className="notes-textarea"
            placeholder="Add your personal notes regarding train schedules, reservations, or contact details..."
            rows={8}
          />
        </div>
      )}
    </div>
  );
}