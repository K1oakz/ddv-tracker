import React, { useState } from 'react';
import { Character, GameSection, CharacterRoleInfo, QuestStatus } from '../types/character';
import { CloseIcon, HeartIcon, GiftIcon, MessageCircleIcon, TrashIcon, CheckIcon } from './Icons';
import { HOUSES_LOCATIONS } from '../data/charactersData';

interface CharacterModalProps {
  character: Character;
  sections: GameSection[];
  roles: CharacterRoleInfo[];
  onClose: () => void;
  onSave: (updated: Character) => void;
  onDelete: (id: string) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  sections,
  roles,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Character>({ ...character });
  const [newGiftItem, setNewGiftItem] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLevelChange = (level: number) => {
    const validLevel = Math.max(1, Math.min(10, level));
    setFormData(prev => ({
      ...prev,
      friendshipLevel: validLevel,
      status: validLevel === 10 ? 'maxed' : (prev.status === 'locked' ? 'unlocked' : prev.status)
    }));
  };

  const handleAddGift = () => {
    if (!newGiftItem.trim()) return;
    setFormData(prev => ({
      ...prev,
      favoriteGifts: [...(prev.favoriteGifts || []), newGiftItem.trim()]
    }));
    setNewGiftItem('');
  };

  const handleRemoveGift = (index: number) => {
    setFormData(prev => ({
      ...prev,
      favoriteGifts: prev.favoriteGifts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUri = ev.target?.result as string;
      if (!dataUri) return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData(prev => ({ ...prev, avatarImage: compressed }));
        } else {
          setFormData(prev => ({ ...prev, avatarImage: dataUri }));
        }
      };
      img.src = dataUri;
    };
    reader.readAsDataURL(file);
  };

  const selectedRole = roles.find(r => r.id === formData.role);

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
          maxHeight: '90vh',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {formData.avatarImage ? (
                <img src={formData.avatarImage} alt={formData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.6rem' }}>{formData.avatarEmoji || formData.name.charAt(0) || '✨'}</span>
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{formData.name}</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {formData.universe}
              </div>
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

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Identity & Expansion Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Character Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
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
                value={formData.universe}
                onChange={(e) => setFormData({ ...formData, universe: e.target.value })}
                required
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
                Base Game or DLC Section
              </label>
              <select
                value={formData.sectionId}
                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
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
                Avatar Emoji / Fallback Icon
              </label>
              <input
                type="text"
                value={formData.avatarEmoji || ''}
                onChange={(e) => setFormData({ ...formData, avatarEmoji: e.target.value })}
                placeholder="e.g. ✨ or 🐭"
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

          {/* Custom Portrait Image Upload / Link */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: 14,
            borderRadius: 14,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Custom Character Portrait
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{
                padding: '8px 14px',
                borderRadius: 9,
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #a855f7',
                color: '#e9d5ff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Upload Portrait Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <input
                type="url"
                value={formData.avatarImage || ''}
                onChange={(e) => setFormData({ ...formData, avatarImage: e.target.value })}
                placeholder="Or paste image URL (https://...)"
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: '8px 12px',
                  borderRadius: 9,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />

              {formData.avatarImage && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatarImage: '' }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 9,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>

          {/* Friendship Level & Status */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: 14,
            borderRadius: 14,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <HeartIcon size={18} style={{ color: 'var(--accent-rose)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  Relationship & Friendship Level:
                </span>
              </div>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: formData.friendshipLevel === 10 ? 'var(--accent-gold)' : 'var(--text-primary)'
              }}>
                Level {formData.friendshipLevel} / 10
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max="10"
              value={formData.friendshipLevel}
              onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                accentColor: formData.friendshipLevel === 10 ? '#fbbf24' : '#a855f7',
                cursor: 'pointer'
              }}
            />

            {/* Status Selector */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {(['locked', 'unlocked', 'maxed'] as const).map(st => (
                <button
                  type="button"
                  key={st}
                  onClick={() => {
                    const newLvl = st === 'maxed' ? 10 : (st === 'locked' ? 1 : formData.friendshipLevel);
                    setFormData({ ...formData, status: st, friendshipLevel: newLvl });
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 10,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    background: formData.status === st 
                      ? (st === 'maxed' ? 'rgba(251, 191, 36, 0.25)' : 'rgba(168, 85, 247, 0.3)')
                      : 'rgba(255, 255, 255, 0.05)',
                    color: formData.status === st 
                      ? (st === 'maxed' ? '#fbbf24' : '#e9d5ff')
                      : 'var(--text-muted)',
                    border: formData.status === st 
                      ? (st === 'maxed' ? '1px solid #fbbf24' : '1px solid #a855f7')
                      : '1px solid var(--border-subtle)'
                  }}
                >
                  {st === 'maxed' ? '⭐ Maxed (Lvl 10)' : st === 'locked' ? '🔒 Locked' : 'Unlocked'}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Hangout Role (Task) */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: 14,
            borderRadius: 14,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Assigned Hangout Task (Bonus Role)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
              {roles.map(r => {
                const isSelected = formData.role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: isSelected ? r.bgColor : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? r.color : 'var(--text-secondary)',
                      border: isSelected ? `1px solid ${r.color}` : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? `0 2px 8px ${r.bgColor}` : 'none',
                      textAlign: 'left'
                    }}
                  >
                    <span>{r.icon}</span>
                    <span>{r.name}</span>
                  </button>
                );
              })}
            </div>
            {selectedRole && (
              <div style={{ fontSize: '0.75rem', color: selectedRole.color, background: selectedRole.bgColor, padding: '6px 10px', borderRadius: 8 }}>
                💡 <strong>Bonus effect:</strong> {selectedRole.description}
              </div>
            )}
          </div>

          {/* Daily Routine Checkmarks */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: 14,
            borderRadius: 14,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: 12
          }}>
            {/* Daily Talk */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Daily Conversation
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, dailyTalked: !formData.dailyTalked })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: formData.dailyTalked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: formData.dailyTalked ? '#6ee7b7' : 'var(--text-muted)',
                  border: formData.dailyTalked ? '1px solid #10b981' : '1px solid var(--border-subtle)'
                }}
              >
                <MessageCircleIcon size={16} />
                <span>{formData.dailyTalked ? 'Spoken With Today ✓' : 'Not Spoken Yet'}</span>
              </button>
            </div>

            {/* Daily Gifts Given (0-3) */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Daily Favorite Gifts (0 - 3)
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2, 3].map(count => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setFormData({ ...formData, dailyGiftsGiven: count })}
                    style={{
                      flex: 1,
                      padding: '9px 0',
                      borderRadius: 10,
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: (formData.dailyGiftsGiven || 0) === count 
                        ? 'rgba(234, 179, 8, 0.25)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      color: (formData.dailyGiftsGiven || 0) === count ? '#fef08a' : 'var(--text-muted)',
                      border: (formData.dailyGiftsGiven || 0) === count ? '1px solid #eab308' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Favorite Gifts List */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Favorite Gifts & Desired Items
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Add favorite gift (e.g. Lobster Roll, Shiny Ruby)..."
                value={newGiftItem}
                onChange={(e) => setNewGiftItem(e.target.value)}
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
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#e9d5ff',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Add Gift
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(formData.favoriteGifts || []).map((gift, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: '0.78rem',
                    background: 'rgba(234, 179, 8, 0.15)',
                    color: '#fef08a',
                    border: '1px solid rgba(234, 179, 8, 0.3)'
                  }}
                >
                  <GiftIcon size={12} />
                  <span>{gift}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGift(idx)}
                    style={{
                      background: 'transparent',
                      color: 'rgba(254, 240, 138, 0.6)',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    <CloseIcon size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* House Location & Quest Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                House / Biome Location
              </label>
              <input
                type="text"
                list="biome-locations"
                value={formData.houseLocation}
                onChange={(e) => setFormData({ ...formData, houseLocation: e.target.value })}
                placeholder="Select or enter biome..."
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
              <datalist id="biome-locations">
                {HOUSES_LOCATIONS.map((loc, i) => (
                  <option key={i} value={loc} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Quest Status
              </label>
              <select
                value={formData.questStatus}
                onChange={(e) => setFormData({ ...formData, questStatus: e.target.value as QuestStatus })}
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
                <option value="none">No active quest</option>
                <option value="available">Quest available ❗</option>
                <option value="in_progress">Quest in progress ⏳</option>
                <option value="completed">All quests completed ✓</option>
              </select>
            </div>
          </div>

          {/* Quest Note / Objective */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Quest Title / Current Objective
            </label>
            <input
              type="text"
              value={formData.questNote}
              onChange={(e) => setFormData({ ...formData, questNote: e.target.value })}
              placeholder="e.g. Level 10 Quest: The Remembered..."
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

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Personal Notes & Reminders
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes on schedules, sleep times, recipe unlocks, etc..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Bottom Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 8,
            paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <TrashIcon size={16} />
                <span>Delete</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => onDelete(character.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600
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
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
                }}
              >
                <CheckIcon size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
