import React, { useState } from 'react';
import { Character, CharacterRoleInfo } from '../types/character';
import { CloseIcon, MessageCircleIcon, GiftIcon, CheckIcon, RefreshIcon } from './Icons';

interface DailyTrackerModalProps {
  characters: Character[];
  roles: CharacterRoleInfo[];
  onClose: () => void;
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onResetDaily: () => void;
}

export const DailyTrackerModal: React.FC<DailyTrackerModalProps> = ({
  characters,
  roles,
  onClose,
  onUpdateCharacter,
  onResetDaily
}) => {
  const [filterMode, setFilterMode] = useState<'in_progress' | 'all'>('in_progress');

  const filtered = characters.filter(c => {
    if (c.status === 'locked') return false;
    if (filterMode === 'in_progress') {
      return c.friendshipLevel < 10;
    }
    return true;
  });

  const total = filtered.length;
  const talkedCount = filtered.filter(c => c.dailyTalked).length;
  const giftsFullCount = filtered.filter(c => (c.dailyGiftsGiven || 0) >= 3).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: 600,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>☀️</span> Daily Routine Checklist
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Quickly knock out daily discussions & favorite gifts
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              borderRadius: 10,
              padding: 6,
              display: 'flex'
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Progress summary banner */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Conversations: </span>
              <strong style={{ color: '#6ee7b7' }}>{talkedCount} / {total}</strong>
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Gifts: </span>
              <strong style={{ color: '#fef08a' }}>{giftsFullCount} / {total}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: 2 }}>
              <button
                onClick={() => setFilterMode('in_progress')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: filterMode === 'in_progress' ? 'var(--accent-purple)' : 'transparent',
                  color: filterMode === 'in_progress' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                In Progress Only
              </button>
              <button
                onClick={() => setFilterMode('all')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: filterMode === 'all' ? 'var(--accent-purple)' : 'transparent',
                  color: filterMode === 'all' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                All
              </button>
            </div>

            <button
              onClick={onResetDaily}
              title="Reset today's checks"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              <RefreshIcon size={12} />
              <span>Reset Daily</span>
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              🎉 All active characters are at max friendship level 10!
            </div>
          ) : (
            filtered.map(character => {
              const roleInfo = roles.find(r => r.id === character.role);

              return (
                <div
                  key={character.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Left: Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    {character.avatarImage ? (
                      <img
                        src={character.avatarImage}
                        alt={character.name}
                        style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{character.avatarEmoji || character.name.charAt(0) || '✨'}</span>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {character.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          Lvl {character.friendshipLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {roleInfo ? `${roleInfo.icon} ${roleInfo.name}` : ''} • 📍 {character.houseLocation || 'Valley'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Talk Button & Gift Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => onUpdateCharacter(character.id, { dailyTalked: !character.dailyTalked })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: character.dailyTalked ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        color: character.dailyTalked ? '#6ee7b7' : 'var(--text-muted)',
                        border: character.dailyTalked ? '1px solid #10b981' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <MessageCircleIcon size={14} />
                      <span>{character.dailyTalked ? 'Done ✓' : 'Talk'}</span>
                    </button>

                    {/* Gifts 0-3 Stepper */}
                    <button
                      onClick={() => {
                        const next = ((character.dailyGiftsGiven || 0) + 1) % 4;
                        onUpdateCharacter(character.id, { dailyGiftsGiven: next });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: (character.dailyGiftsGiven || 0) > 0 ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        color: (character.dailyGiftsGiven || 0) > 0 ? '#fef08a' : 'var(--text-muted)',
                        border: (character.dailyGiftsGiven || 0) > 0 ? '1px solid #eab308' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <GiftIcon size={14} />
                      <span>{character.dailyGiftsGiven || 0}/3 Gifts</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
