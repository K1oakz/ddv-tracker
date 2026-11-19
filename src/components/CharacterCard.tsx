import React from 'react';
import { Character, GameSection, CharacterRoleInfo } from '../types/character';
import { HeartIcon, MessageCircleIcon, GiftIcon, EditIcon } from './Icons';

interface CharacterCardProps {
  character: Character;
  section?: GameSection;
  roleInfo?: CharacterRoleInfo;
  roles: CharacterRoleInfo[];
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onSelectCharacter: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  section,
  roleInfo,
  roles,
  onUpdateCharacter,
  onSelectCharacter
}) => {
  const isMaxed = character.friendshipLevel >= 10 || character.status === 'maxed';
  const isLocked = character.status === 'locked';

  const handleLevelChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const newLevel = Math.max(1, Math.min(10, character.friendshipLevel + delta));
    const newStatus = newLevel === 10 ? 'maxed' : (isLocked ? 'unlocked' : character.status);
    onUpdateCharacter(character.id, {
      friendshipLevel: newLevel,
      status: newStatus
    });
  };

  const handleToggleDailyTalk = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateCharacter(character.id, {
      dailyTalked: !character.dailyTalked
    });
  };

  const handleToggleDailyGift = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = character.dailyGiftsGiven || 0;
    const next = (current + 1) % 4; // Cycle 0 -> 1 -> 2 -> 3 -> 0
    onUpdateCharacter(character.id, {
      dailyGiftsGiven: next
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onUpdateCharacter(character.id, {
      role: e.target.value
    });
  };

  return (
    <div
      onClick={() => onSelectCharacter(character)}
      style={{
        background: isLocked 
          ? 'linear-gradient(145deg, rgba(30, 32, 56, 0.4) 0%, rgba(20, 22, 38, 0.6) 100%)' 
          : isMaxed
            ? 'linear-gradient(145deg, rgba(35, 38, 70, 0.95) 0%, rgba(26, 29, 52, 0.9) 100%)'
            : 'linear-gradient(145deg, rgba(30, 33, 60, 0.85) 0%, rgba(22, 24, 46, 0.85) 100%)',
        borderRadius: 16,
        padding: 14,
        border: isMaxed 
          ? '1px solid rgba(251, 191, 36, 0.4)' 
          : isLocked
            ? '1px solid rgba(255, 255, 255, 0.05)'
            : '1px solid var(--border-subtle)',
        boxShadow: isMaxed ? '0 4px 20px -5px rgba(251, 191, 36, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 12,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer',
        position: 'relative',
        opacity: isLocked ? 0.75 : 1
      }}
    >
      {/* Top row: Avatar, Info, and Section Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Avatar badge */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: isLocked 
            ? 'rgba(100, 116, 139, 0.2)' 
            : isMaxed 
              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)' 
              : 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          border: isMaxed ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {character.avatarImage ? (
            <img
              src={character.avatarImage}
              alt={character.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            character.avatarEmoji || character.name.charAt(0) || '✨'
          )}
        </div>

        {/* Character Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {character.name}
            </h3>

            {/* DLC / Section Badge */}
            {section && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                background: section.badgeBg,
                color: section.color,
                border: `1px solid ${section.color}40`,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {section.name}
              </span>
            )}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {character.universe} • 📍 {character.houseLocation || 'Valley'}
          </div>
        </div>
      </div>

      {/* Middle row: Assigned Task / Role & Friendship Progress */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 12,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {/* Task (Role) Assignment */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Hangout Task:
          </span>

          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <select
              value={character.role}
              onChange={handleRoleChange}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 8,
                background: roleInfo ? roleInfo.bgColor : 'rgba(255, 255, 255, 0.08)',
                color: roleInfo ? roleInfo.color : 'var(--text-secondary)',
                border: roleInfo ? `1px solid ${roleInfo.color}60` : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.icon} {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Friendship Level bar & +/- controls */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <HeartIcon size={14} filled={isMaxed} className={isMaxed ? 'gold-glow' : ''} style={{ color: isMaxed ? 'var(--accent-gold)' : 'var(--accent-rose)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isMaxed ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                {isLocked ? 'Locked' : `Friendship Lvl ${character.friendshipLevel}/10`}
              </span>
            </div>

            {/* Quick Level Stepper Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={(e) => handleLevelChange(e, -1)}
                disabled={character.friendshipLevel <= 1}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  opacity: character.friendshipLevel <= 1 ? 0.3 : 1
                }}
              >
                -
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, width: 18, textAlign: 'center' }}>
                {character.friendshipLevel}
              </span>
              <button
                onClick={(e) => handleLevelChange(e, 1)}
                disabled={character.friendshipLevel >= 10}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#e9d5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  opacity: character.friendshipLevel >= 10 ? 0.3 : 1
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Visual progress bar */}
          <div style={{
            height: 6,
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(character.friendshipLevel / 10) * 100}%`,
              background: isMaxed 
                ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' 
                : 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Bottom row: Daily routine quick toggles & Quest notes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingTop: 4
      }}>
        {/* Daily Talk Toggle */}
        <button
          onClick={handleToggleDailyTalk}
          title={character.dailyTalked ? "Spoken with today!" : "Click to mark spoken today"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 9px',
            borderRadius: 8,
            fontSize: '0.72rem',
            fontWeight: 600,
            background: character.dailyTalked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: character.dailyTalked ? '#6ee7b7' : 'var(--text-muted)',
            border: character.dailyTalked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)'
          }}
        >
          <MessageCircleIcon size={14} />
          <span>{character.dailyTalked ? "Talked ✓" : "Talk"}</span>
        </button>

        {/* Daily 3 Gifts Multi-Toggle */}
        <button
          onClick={handleToggleDailyGift}
          title="Click to cycle daily gifts given (0, 1, 2, 3)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 9px',
            borderRadius: 8,
            fontSize: '0.72rem',
            fontWeight: 600,
            background: (character.dailyGiftsGiven || 0) > 0 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: (character.dailyGiftsGiven || 0) > 0 ? '#fef08a' : 'var(--text-muted)',
            border: (character.dailyGiftsGiven || 0) > 0 ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid var(--border-subtle)'
          }}
        >
          <GiftIcon size={14} />
          <span>Gifts: {character.dailyGiftsGiven || 0}/3</span>
        </button>

        {/* Details / Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectCharacter(character);
          }}
          style={{
            padding: 6,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Open character details & quests"
        >
          <EditIcon size={14} />
        </button>
      </div>

      {/* Quest snippet if active */}
      {character.questNote && (
        <div style={{
          fontSize: '0.7rem',
          color: '#cbd5e1',
          background: 'rgba(99, 102, 241, 0.12)',
          padding: '4px 8px',
          borderRadius: 6,
          borderLeft: '2px solid #818cf8',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          📜 {character.questNote}
        </div>
      )}
    </div>
  );
};
