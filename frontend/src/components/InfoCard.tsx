import React, { ReactElement } from 'react';
import { ShieldCheck, Phone, CreditCard, AlertCircle, Sparkles } from 'lucide-react';
import { GeneralInfoSection, IconKey } from '../types';

const ICON_MAP: Record<IconKey, ReactElement> = {
  ShieldCheck: <ShieldCheck size={18} />,
  Phone: <Phone size={18} />,
  CreditCard: <CreditCard size={18} />,
  AlertCircle: <AlertCircle size={18} />,
  Sparkles: <Sparkles size={18} />
};

interface InfoCardProps {
  section: GeneralInfoSection;
}

export const InfoCard: React.FC<InfoCardProps> = ({ section }) => {
  const icon = ICON_MAP[section.iconName] ?? <Sparkles size={18} />;

  return (
    <section className="info-card">
      <div className="info-card-header">
        {icon}
        <h3>{section.title}</h3>
      </div>
      <ul className="info-card-list">
        {section.items.map((item) => (
          <li key={item.id} className="info-item-row">
            {item.source && item.source !== 'travel_diary' && (
              <span className={`source-badge ${item.source}`}>
                {item.source}
              </span>
            )}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};