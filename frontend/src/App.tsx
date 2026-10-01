import React, { useState, ChangeEvent } from 'react';
import { ActiveTab, GeneralInfoSection, DaySchedule, TelegramExport } from './types';
import { INITIAL_GENERAL_INFO, INITIAL_ITINERARY } from './data/initialData';
import { generateAIEnhancements } from './services/aiService';

import { Header } from './components/Header';
import { TabsNav } from './components/TabsNav';
import { SyncButton } from './components/SyncButton';
import { TelegramUploader } from './components/TelegramUploader';
import { DayCard } from './components/DayCard';
import { InfoCard } from './components/InfoCard';
import './App.css';

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ITINERARY');
  const [loadingEnrich, setLoadingEnrich] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  const [customTelegramText, setCustomTelegramText] = useState<string>('');
  const [telegramFileName, setTelegramFileName] = useState<string>(
    'telegram_chat.json (Preloaded route export)'
  );
  const [isCustomChat, setIsCustomChat] = useState<boolean>(false);

  const [generalInfo, setGeneralInfo] = useState<GeneralInfoSection[]>(INITIAL_GENERAL_INFO);
  const [itinerary, setItinerary] = useState<DaySchedule[]>(INITIAL_ITINERARY);

  const handleTelegramFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTelegramFileName(file.name);
    setIsCustomChat(true);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed: TelegramExport = JSON.parse(content);
          const messages = (parsed.messages || [])
            .filter((m) => m.type === 'message' && typeof m.text === 'string')
            .map((m) => `[${m.date}] ${m.from}: ${m.text as string}`)
            .slice(-250)
            .join('\n');
          setCustomTelegramText(messages);
        } else {
          setCustomTelegramText(content);
        }
      } catch (err) {
        console.error("Error reading Telegram export:", err);
      }
    };
    reader.readAsText(file);
  };

  const handleAutoSync = async (): Promise<void> => {
    if (isSynced || loadingEnrich) return;
    setLoadingEnrich(true);

    try {
      const { generalInfoUpdates, itineraryUpdates } = await generateAIEnhancements({
        itinerary,
        telegram_chat: customTelegramText
      });

      if (generalInfoUpdates.length > 0) {
        setGeneralInfo((prevInfo) => {
          const existingIndex = prevInfo.findIndex((sec) => sec.categoryKey === 'ai_tips');

          if (existingIndex !== -1) {
            return prevInfo.map((sec, idx) =>
              idx === existingIndex
                ? { ...sec, items: [...sec.items, ...generalInfoUpdates] }
                : sec
            );
          }

          return [
            ...prevInfo,
            {
              categoryKey: 'ai_tips',
              title: 'AI Coordinator Insights & Local Tips',
              iconName: 'Sparkles',
              items: generalInfoUpdates
            }
          ];
        });
      }

      if (itineraryUpdates.length > 0) {
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
                  source: n.source
                }))
              ]
            };
          })
        );
      }

      setIsSynced(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown synchronization error';
      console.error("Sync Error:", error);
      alert(`Could not fetch AI recommendations: ${message}`);
    } finally {
      setLoadingEnrich(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'ITINERARY' && (
        <main className="itinerary-list">
          <TelegramUploader
            isCustomChat={isCustomChat}
            fileName={telegramFileName}
            onFileUpload={handleTelegramFileUpload}
          />
          <SyncButton
            loading={loadingEnrich}
            isSynced={isSynced}
            onClick={handleAutoSync}
          />
          {itinerary.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </main>
      )}

      {activeTab === 'GENERAL INFO' && (
        <main className="general-info-list">
          <TelegramUploader
            isCustomChat={isCustomChat}
            fileName={telegramFileName}
            onFileUpload={handleTelegramFileUpload}
          />
          <SyncButton
            loading={loadingEnrich}
            isSynced={isSynced}
            onClick={handleAutoSync}
          />
          {generalInfo.map((section) => (
            <InfoCard key={section.categoryKey} section={section} />
          ))}
        </main>
      )}

      {activeTab === 'YOUR NOTES' && (
        <section className="info-card">
          <div className="info-card-header">
            <h3>Coordinator Notes</h3>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Add your personal notes regarding train schedules, reservations, or contact details..."
            rows={8}
            aria-label="Coordinator Notes"
          />
        </section>
      )}
    </div>
  );
}