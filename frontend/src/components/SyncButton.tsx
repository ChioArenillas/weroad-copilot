import React from 'react';
import { Sparkles } from 'lucide-react';

interface SyncButtonProps {
  loading: boolean;
  isSynced: boolean;
  onClick: () => void;
}

export const SyncButton: React.FC<SyncButtonProps> = ({ loading, isSynced, onClick }) => {
  return (
    <button
      type="button"
      className={`ai-sync-btn ${isSynced ? 'synced' : ''}`}
      onClick={onClick}
      disabled={loading || isSynced}
    >
      <Sparkles size={16} />
      {loading
        ? "Syncing with Telegram & Tips..."
        : isSynced
          ? "Telegram & Tips Synced"
          : "Sync Telegram Alerts & Tips"}
    </button>
  );
};