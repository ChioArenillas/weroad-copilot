import React, { ChangeEvent } from 'react';
import { MessageCircle, Upload } from 'lucide-react';

interface TelegramUploaderProps {
  isCustomChat: boolean;
  fileName: string;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TelegramUploader: React.FC<TelegramUploaderProps> = ({
  isCustomChat,
  fileName,
  onFileUpload
}) => {
  return (
    <div
      style={{
        border: isCustomChat ? '2px solid #10b981' : '1px dashed #cbd5e1',
        backgroundColor: isCustomChat ? '#f0fdf4' : '#ffffff',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            backgroundColor: isCustomChat ? '#dcfce7' : '#fee2e2',
            color: isCustomChat ? '#16a34a' : '#ef4444',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex'
          }}
        >
          <MessageCircle size={20} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
              Telegram Route Community Source
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: isCustomChat ? '#dcfce7' : '#f1f5f9',
                color: isCustomChat ? '#15803d' : '#64748b'
              }}
            >
              {isCustomChat ? 'Custom Export Active' : 'Default Sample Ready'}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            Current file: <code>{fileName}</code>
          </div>
        </div>
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#fff',
          border: '1px solid #cbd5e1',
          color: '#334155',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        <Upload size={14} />
        Upload Chat (.json/.txt)
        <input
          type="file"
          accept=".json,.txt"
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};