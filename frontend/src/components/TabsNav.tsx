import React from 'react';
import { ActiveTab } from '../types';

interface TabsNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: ActiveTab[] = ['GENERAL INFO', 'ITINERARY', 'YOUR NOTES'];

  return (
    <nav className="tabs-container" aria-label="Diary sections">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};