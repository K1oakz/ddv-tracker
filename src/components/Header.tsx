import React from 'react';
import { SparklesIcon, CheckSquareIcon, PieChartIcon, PlusIcon, DownloadIcon, UploadIcon, RefreshIcon } from './Icons';
import { Character } from '../types/character';

interface HeaderProps {
  characters: Character[];
  onOpenAddModal: () => void;
  onOpenDailyModal: () => void;
  onOpenStatsModal: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetDaily: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  characters,
  onOpenAddModal,
  onOpenDailyModal,
  onOpenStatsModal,
  onExportData,
  onImportData,
  onResetDaily
}) => {
  const total = characters.length;
  const maxed = characters.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed').length;
  const inProgress = characters.filter(c => c.status === 'unlocked' && c.friendshipLevel < 10).length;
  const dailyTalksDone = characters.filter(c => c.dailyTalked).length;

  return (
    <header style={{
      padding: 'calc(var(--safe-top) + 16px) 16px 14px',
      background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top bar with title and action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
              color: '#ffffff'
            }}>
              <SparklesIcon size={24} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff 0%, #e2e8f0 50%, #fef08a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                Dreamlight Valley
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Character & Role Companion
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onOpenDailyModal}
              title="Daily Checklist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 10,
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#fef08a',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <CheckSquareIcon size={16} />
              <span>Daily ({dailyTalksDone}/{total})</span>
            </button>

            <button
              onClick={onOpenStatsModal}
              title="Role & Friendship Statistics"
              style={{
                padding: 8,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PieChartIcon size={18} />
            </button>

            <button
              onClick={onResetDaily}
              title="Reset Daily Interactions"
              style={{
                padding: 8,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RefreshIcon size={18} />
            </button>

            <button
              onClick={onExportData}
              title="Export Data Backup"
              style={{
                padding: 8,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DownloadIcon size={18} />
            </button>

            <button
              onClick={onImportData}
              title="Import Data Backup"
              style={{
                padding: 8,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UploadIcon size={18} />
            </button>

            <button
              onClick={onOpenAddModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.35)'
              }}
            >
              <PlusIcon size={18} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Mini stats banner */}
        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Unlocked
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
              {total - characters.filter(c => c.status === 'locked').length} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {total}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Max Friendship (Lvl 10)
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {maxed} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({Math.round((maxed / (total || 1)) * 100)}%)</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              In Progress
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#a855f7' }}>
              {inProgress}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
