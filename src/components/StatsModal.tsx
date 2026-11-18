import React from 'react';
import { Character, GameSection, CharacterRoleInfo } from '../types/character';
import { CloseIcon, SparklesIcon } from './Icons';

interface StatsModalProps {
  characters: Character[];
  sections: GameSection[];
  roles: CharacterRoleInfo[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  characters,
  sections,
  roles,
  onClose
}) => {
  const total = characters.length;
  const maxed = characters.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed').length;
  const inProgress = characters.filter(c => c.status === 'unlocked' && c.friendshipLevel < 10).length;
  const locked = characters.filter(c => c.status === 'locked').length;

  const totalPossibleLevels = total * 10;
  const currentTotalLevels = characters.reduce((sum, c) => sum + (c.friendshipLevel || 1), 0);
  const overallFriendshipPct = Math.round((currentTotalLevels / (totalPossibleLevels || 1)) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: 580,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
      >
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
              <span>📊</span> Valley Statistics & Hangout Bonuses
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Companion task allocations and relationship progress
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

        <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Overall Friendship Progress Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            padding: 16,
            borderRadius: 16,
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e9d5ff' }}>
                Overall Valley Friendship Completion
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {overallFriendshipPct}%
              </span>
            </div>

            <div style={{ height: 8, borderRadius: 999, background: 'rgba(0,0,0,0.3)', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{
                height: '100%',
                width: `${overallFriendshipPct}%`,
                background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #fbbf24 100%)'
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Maxed (Lvl 10)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{maxed}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>In Progress</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#a855f7' }}>{inProgress}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Locked</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#64748b' }}>{locked}</div>
              </div>
            </div>
          </div>

          {/* Hangout Roles Distribution */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⛏️</span> Hangout Tasks Breakdown
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              In DDV, assigning 5+ companions to a role gives higher yields and double chance during hangouts!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {roles.map(r => {
                const count = characters.filter(c => c.role === r.id).length;
                const pct = Math.round((count / (total || 1)) * 100);

                return (
                  <div
                    key={r.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: r.color }}>{r.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {count} {count === 1 ? 'villager' : 'villagers'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({pct}%)
                        </span>
                      </div>
                    </div>

                    <div style={{ height: 6, borderRadius: 999, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: r.color
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Distribution */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🏰</span> Base Game & DLC Breakdown
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              {sections.map(s => {
                const sectionChars = characters.filter(c => c.sectionId === s.id);
                const count = sectionChars.length;
                const sectionMaxed = sectionChars.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed').length;

                return (
                  <div
                    key={s.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 12,
                      padding: 12,
                      border: `1px solid ${s.color}40`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{s.icon}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                      {count} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>chars</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)' }}>
                      ⭐ {sectionMaxed} maxed ({Math.round((sectionMaxed / (count || 1)) * 100)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
