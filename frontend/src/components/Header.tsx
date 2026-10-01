import React from 'react';
import { Download } from 'lucide-react';

export const Header: React.FC = () => {
  const handleDownload = (): void => {
    alert(
      "PDF export is currently in the roadmap. In production, this generates a printable offline diary with Telegram notes integrated into the margins."
    );
  };

  return (
    <header className="weroad-header-card">
      <div className="header-info">
        <h2>Your Travel Diary</h2>
        <p>Sri Lanka & Maldives (SMS) • Download the PDF version to access offline.</p>
      </div>
      <button 
        type="button" 
        className="download-pdf-btn" 
        onClick={handleDownload}
        aria-label="Download Travel Diary"
      >
        <Download size={14} style={{ marginRight: '6px' }} /> Download Travel Diary
      </button>
    </header>
  );
};