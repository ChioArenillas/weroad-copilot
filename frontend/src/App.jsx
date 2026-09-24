import React, { useState } from 'react';
import { Sparkles, Bed, Utensils, Download, AlertCircle, Phone, CreditCard, ShieldCheck } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('ITINERARY');
  const [loadingEnrich, setLoadingEnrich] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // 1. GENERAL INFORMATION FROM TRAVEL DIARY
  const generalInfo = [
    {
      title: "Requirements & Visa (ETA)",
      icon: <ShieldCheck size={18} />,
      items: [
        "Sri Lanka ETA: Free of charge starting May 25, 2026 for Spanish and Italian citizens (apply via official portal only).",
        "Maldives: IMUGA Traveller Declaration form mandatory prior to boarding.",
        "Vaccinations: Yellow Fever Certificate required only if traveling from endemic areas."
      ]
    },
    {
      title: "Local Partners & Emergency Contacts",
      icon: <Phone size={18} />,
      items: [
        "Sri Lanka: Wanderlust Asia (+94 77 706 7295) — Contact only for voucher discrepancies or actual emergencies starting 3 days prior to arrival.",
        "Maldives: Giorgia Atripaldi (Maldives Fellas: +39 339 6351542) / ShadowPalm (+960 9960109) / Alba (+39 340 864 7210).",
        "Maafushi Accommodation Contact: Triton Hotel Manager Malithi (+960 7629991)."
      ]
    },
    {
      title: "Budget & Group Fund",
      icon: <CreditCard size={18} />,
      items: [
        "Sri Lanka Group Kitty: Approx. €200 per person for shared entrance fees and group transportation.",
        "Meals: Average €7 to €10 per lunch/dinner.",
        "Maldives: Excursions are 100% optional and paid individually (USD and EUR cash accepted)."
      ]
    },
    {
      title: "Packing List & Essentials",
      icon: <AlertCircle size={18} />,
      items: [
        "Temples: Shoulders and knees must be covered (bring a sarong or long trousers).",
        "Temple Socks: Stone floors heat up significantly during midday sun.",
        "Power Adapter: Type BS546 (commonly used across Sri Lanka).",
        "Health: High-strength mosquito repellent (Dengue prophylaxis)."
      ]
    }
  ];

  // 2. DAY-BY-DAY ITINERARY FROM TRAVEL DIARY
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

  // RICH AI SYNC (Comprehensive updates across all 12 days)
  const handleAutoSync = () => {
    if (isSynced) return;

    setLoadingEnrich(true);

    setTimeout(() => {
      const externalUpdates = [
        // Day 1
        { day: 1, id: "tg-1", text: "Telegram: Meeting in the lobby at 8:00 PM for dinner at Lords Restaurant.", source: "telegram" },
        { day: 1, id: "tip-1", text: "Coordinator Tip: Buy a Dialog SIM card at the counter right outside arrivals (cheapest rate & best coverage).", source: "tip" },
        
        // Day 2
        { day: 2, id: "tg-2", text: "Telegram: Dress code reminder: Shoulders and knees must be covered for all temple visits today.", source: "telegram" },
        { day: 2, id: "tip-2", text: "Coordinator Tip: Wear slip-on shoes or sandals as you will need to remove them repeatedly at sacred sites.", source: "tip" },

        // Day 3
        { day: 3, id: "tg-3", text: "Telegram: Jeep safari departs at 2:30 PM sharp. Bring sunglasses, dust bandana/mask, and camera zoom lenses.", source: "telegram" },
        { day: 3, id: "tip-3", text: "Coordinator Tip: Village lunch includes vegetarian options; inform your coordinator in the morning regarding severe allergies.", source: "tip" },

        // Day 4
        { day: 4, id: "tg-4", text: "Telegram: Pack a clean pair of thick socks to avoid burning your feet on hot stone floors in Dambulla & Kandy.", source: "telegram" },
        { day: 4, id: "tip-4", text: "Coordinator Tip: At the Temple of the Tooth (6:15 PM), keep phones silent and refrain from taking selfies facing Buddha statues.", source: "tip" },

        // Day 5
        { day: 5, id: "tg-5", text: "Telegram: Train seats assigned! Keep your small daypack with valuables next to you; large backpacks go on overhead racks.", source: "telegram" },
        { day: 5, id: "tip-5", text: "Coordinator Tip: Sit on the right side of the train (direction Nanu Oya -> Ella) for the best mountain tea valley panoramas.", source: "tip" },

        // Day 6
        { day: 6, id: "tg-6", text: "Telegram: For Nine Arches Bridge photo, train passes around 11:45 AM. Group photo meeting at 11:15 AM at Asanka Cafe viewpoint.", source: "telegram" },
        { day: 6, id: "tip-6", text: "Coordinator Tip: Hire driver Muditha (+94 0711971070) for quick tuk-tuk rides back up the hill from Nine Arches.", source: "tip" },

        // Day 7
        { day: 7, id: "tg-7", text: "Telegram: Dry bags recommended for Kitulgala rafting! You can leave main dry luggage safely inside the van.", source: "telegram" },
        { day: 7, id: "tip-7", text: "Coordinator Tip: Locker rentals and warm showers are available at the rafting basecamp for 500 LKR.", source: "tip" },

        // Day 8
        { day: 8, id: "tg-8", text: "Telegram: Remember to complete your IMUGA entry declaration in the app before boarding your flight to Malé.", source: "telegram" },
        { day: 8, id: "tip-8", text: "Coordinator Tip: Exchange remaining LKR at Colombo Airport before security; LKR currency is not accepted in Maldives.", source: "tip" },

        // Day 9
        { day: 9, id: "tg-9", text: "Telegram: Nurse Shark excursion briefing at 8:30 AM at the beach. Reef-safe sunscreen is mandatory!", source: "telegram" },
        { day: 9, id: "tip-9", text: "Coordinator Tip: GoPro footage is included free with ShadowPalm tours; bring a microSD card or phone adapter to transfer files.", source: "tip" },

        // Day 10
        { day: 10, id: "tg-10", text: "Telegram: Gulhi island boat leaves at 9:30 AM from Maafushi jetty. Grab beach towels from hotel reception.", source: "telegram" },
        { day: 10, id: "tip-10", text: "Coordinator Tip: Gulhi's bikini beach is quieter with crystal clear waters; ideal spot for drone photography.", source: "tip" },

        // Day 11
        { day: 11, id: "tg-11", text: "Telegram: Farewell beach BBQ starts at 7:30 PM near Arena Beach. Dress code: Smart Casual / Beach Chic!", source: "telegram" },
        { day: 11, id: "tip-11", text: "Coordinator Tip: Olhuveli Resort day pass includes lunch buffet and free-flowing drinks from 10:00 AM to 5:00 PM.", source: "tip" },

        // Day 12
        { day: 12, id: "tg-12", text: "Telegram: Speedboat departures to Malé Airport scheduled at 08:00 AM, 12:30 PM, and 4:00 PM. Confirm your flight time with the coordinator.", source: "telegram" },
        { day: 12, id: "tip-12", text: "Coordinator Tip: If you have a late departure flight, Triton Hotel provides free luggage storage and shower facilities post check-out.", source: "tip" }
      ];

      setItinerary(prevItinerary => {
        return prevItinerary.map(dayObj => {
          const newItemsForDay = externalUpdates.filter(
            newItem => newItem.day === dayObj.day && !dayObj.items.some(item => item.id === newItem.id)
          );

          if (newItemsForDay.length === 0) return dayObj;

          return {
            ...dayObj,
            items: [
              ...dayObj.items,
              ...newItemsForDay.map(n => ({ id: n.id, text: n.text, source: n.source }))
            ]
          };
        });
      });

      setIsSynced(true);
      setLoadingEnrich(false);
    }, 800);
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
                    <span>{item.text}</span>
                    {item.source !== 'travel_diary' && (
                      <span className={`source-badge ${item.source}`}>
                        {item.source}
                      </span>
                    )}
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
          {generalInfo.map((section, idx) => (
            <div key={idx} className="info-card">
              <div className="info-card-header">
                {section.icon}
                <h3>{section.title}</h3>
              </div>
              <ul className="info-card-list">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
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