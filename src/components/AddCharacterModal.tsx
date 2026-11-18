import React, { useState } from 'react';
import { Character, GameSection, CharacterRoleInfo } from '../types/character';
import { CloseIcon, PlusIcon } from './Icons';
import { HOUSES_LOCATIONS } from '../data/charactersData';

interface AddCharacterModalProps {
  sections: GameSection[];
  roles: CharacterRoleInfo[];
  defaultSectionId: string;
  onClose: () => void;
  onAdd: (newChar: Character) => void;
}

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  sections,
  roles,
  defaultSectionId,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [universe, setUniverse] = useState('');
  const [sectionId, setSectionId] = useState(defaultSectionId === 'all' ? 'base' : defaultSectionId);
  const [role, setRole] = useState('gardening');
  const [friendshipLevel, setFriendshipLevel] = useState(1);
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'maxed'>('unlocked');
  const [avatarEmoji, setAvatarEmoji] = useState('✨');
  const [houseLocation, setHouseLocation] = useState('Plaza');
  const [favoriteGifts, setFavoriteGifts] = useState<string[]>([]);
  const [giftInput, setGiftInput] = useState('');
  const [questNote, setQuestNote] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddGift = () => {
    if (!giftInput.trim()) return;
    setFavoriteGifts([...favoriteGifts, giftInput.trim()]);
    setGiftInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newCharacter: Character = {
      id,
      name: name.trim(),
      universe: universe.trim() || 'Disney',
      sectionId,
      role,
      friendshipLevel,
      status,
      dailyTalked: false,
      dailyGiftsGiven: 0,
      favoriteGifts,
      questStatus: 'available',
      questNote: questNote.trim(),
      houseLocation: houseLocation.trim() || 'Dreamlight Valley',
      notes: notes.trim(),
      avatarEmoji: avatarEmoji.trim() || '✨',
      isCustom: true
    };

    onAdd(newCharacter);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: 540,
          maxHeight: '90vh',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🌟</span>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add New Character</h2>
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

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Character Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Peter Pan, Cinderella..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Franchise / Universe
              </label>
              <input
                type="text"
                placeholder="e.g. Peter Pan, Hercules..."
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Section / Expansion
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} ({s.subtitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Emoji Avatar
              </label>
              <input
                type="text"
                placeholder="e.g. 🧚"
                value={avatarEmoji}
                onChange={(e) => setAvatarEmoji(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Assigned Hangout Task (Role) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Assigned Hangout Task (Role)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
              {roles.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: role === r.id ? r.bgColor : 'rgba(255, 255, 255, 0.04)',
                    color: role === r.id ? r.color : 'var(--text-secondary)',
                    border: role === r.id ? `1px solid ${r.color}` : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Friendship Level & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Friendship Level (1 - 10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={friendshipLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setFriendshipLevel(val);
                  if (val === 10) setStatus('maxed');
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="unlocked">Unlocked</option>
                <option value="maxed">Maxed (Level 10)</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>

          {/* House Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              House / Biome Location
            </label>
            <input
              type="text"
              list="new-biome-locations"
              value={houseLocation}
              onChange={(e) => setHouseLocation(e.target.value)}
              placeholder="Select or enter biome location..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
            <datalist id="new-biome-locations">
              {HOUSES_LOCATIONS.map((loc, i) => (
                <option key={i} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Favorite gifts */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Favorite Gifts
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input
                type="text"
                placeholder="Item name..."
                value={giftInput}
                onChange={(e) => setGiftInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGift();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              />
              <button
                type="button"
                onClick={handleAddGift}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Add
              </button>
            </div>
            {favoriteGifts.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {favoriteGifts.map((g, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#fef08a'
                    }}
                  >
                    🎁 {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any helpful notes, schedules, or quest tips..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <PlusIcon size={16} />
              <span>Add Character</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
