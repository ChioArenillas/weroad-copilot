import React from 'react';
import { Bed, Utensils } from 'lucide-react';
import { DaySchedule } from '../types';

interface DayCardProps {
  day: DaySchedule;
}

export const DayCard: React.FC<DayCardProps> = ({ day }) => {
  return (
    <article className="day-card">
      <header>
        <div className="day-header-top">Day {day.day} • {day.date}</div>
        <h3 className="day-header-title">{day.title}</h3>
      </header>

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
    </article>
  );
};