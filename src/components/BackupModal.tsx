import React, { useState, useMemo } from 'react';
import { Character, GameSection, CharacterRoleInfo, FilterOptions } from '../types/character';
import { CloseIcon, DownloadIcon, UploadIcon, CheckIcon, RefreshIcon } from './Icons';

interface BackupPayload {
  app: string;
  version: number;
  exportedAt: string;
  summary: {
    totalCharacters: number;
    unlockedCharacters: number;
    maxedCharacters: number;
    totalFriendshipLevels: number;
    hangoutTaskCounts: Record<string, number>;
  };
  sections: GameSection[];
  characters: Character[];
  filters?: FilterOptions;
}

interface BackupModalProps {
  characters: Character[];
  sections: GameSection[];
  roles: CharacterRoleInfo[];
  filters: FilterOptions;
  initialTab?: 'export' | 'import';
  onClose: () => void;
  onImportStatus: (data: {
    characters: Character[];
    sections?: GameSection[];
    filters?: FilterOptions;
  }) => void;
  onResetToDefaults: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  characters,
  sections,
  roles,
  filters,
  initialTab = 'export',
  onClose,
  onImportStatus,
  onResetToDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [pasteJson, setPasteJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Build hangout task counts and export payload
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    roles.forEach(r => {
      counts[r.id] = characters.filter(c => c.role === r.id).length;
    });
    return counts;
  }, [characters, roles]);

  const exportPayload: BackupPayload = useMemo(() => {
    const total = characters.length;
    const unlocked = characters.filter(c => c.status !== 'locked').length;
    const maxed = characters.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed').length;
    const totalFriendshipLevels = characters.reduce((sum, c) => sum + (c.friendshipLevel || 1), 0);

    return {
      app: 'DreamlightValleyCompanion',
      version: 2,
      exportedAt: new Date().toISOString(),
      summary: {
        totalCharacters: total,
        unlockedCharacters: unlocked,
        maxedCharacters: maxed,
        totalFriendshipLevels,
        hangoutTaskCounts: roleCounts
      },
      sections,
      characters,
      filters
    };
  }, [characters, sections, filters, roleCounts]);

  const jsonString = useMemo(() => JSON.stringify(exportPayload, null, 2), [exportPayload]);

  const handleDownloadFile = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ddv_companion_status_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({
        type: 'success',
        text: `Exported ${characters.length} characters, friendship levels, and hangout tasks to ddv_companion_status_${dateStr}.json`
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Could not trigger file download. Try "Copy Status JSON" below instead.'
      });
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setStatusMessage({
        type: 'success',
        text: 'Current app status JSON copied to clipboard!'
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older WebViews
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setStatusMessage({
        type: 'success',
        text: 'Current app status JSON copied to clipboard!'
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareStatus = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dreamlight Valley Companion Status Backup',
          text: jsonString
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const normalizeRole = (rawRole: string | undefined): string => {
    if (!rawRole) return 'none';
    const lowered = rawRole.toLowerCase().trim();
    if (lowered === 'snippet catching' || lowered === 'snippet_catching' || lowered === 'snippetcatching') {
      return 'snippet_catching';
    }
    const matched = roles.find(
      r => r.id.toLowerCase() === lowered || r.name.toLowerCase() === lowered
    );
    return matched ? matched.id : rawRole;
  };

  const parseAndRestoreJson = (rawText: string) => {
    try {
      const parsed = JSON.parse(rawText);
      const rawChars = Array.isArray(parsed)
        ? parsed
        : parsed && Array.isArray(parsed.characters)
          ? parsed.characters
          : null;

      if (!rawChars || rawChars.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'Invalid backup format: no character list found in JSON.'
        });
        return;
      }

      const validatedCharacters: Character[] = rawChars.map((c: any, idx: number) => {
        const level = Math.max(1, Math.min(10, Number(c.friendshipLevel) || 1));
        const status: 'locked' | 'unlocked' | 'maxed' =
          c.status === 'locked' || c.status === 'unlocked' || c.status === 'maxed'
            ? c.status
            : level >= 10
              ? 'maxed'
              : 'unlocked';

        return {
          id: String(c.id || `char_${idx}_${Date.now()}`),
          name: String(c.name || 'Unnamed Character'),
          universe: String(c.universe || 'Disney'),
          sectionId: String(c.sectionId || 'base'),
          role: normalizeRole(c.role || c.hangoutTask),
          friendshipLevel: level,
          status,
          dailyTalked: Boolean(c.dailyTalked),
          dailyGiftsGiven: Math.max(0, Math.min(3, Number(c.dailyGiftsGiven) || 0)),
          favoriteGifts: Array.isArray(c.favoriteGifts) ? c.favoriteGifts.map(String) : [],
          questStatus:
            c.questStatus === 'available' ||
            c.questStatus === 'in_progress' ||
            c.questStatus === 'completed' ||
            c.questStatus === 'none'
              ? c.questStatus
              : 'none',
          questNote: String(c.questNote || ''),
          houseLocation: String(c.houseLocation || 'Dreamlight Valley'),
          notes: String(c.notes || ''),
          isCustom: Boolean(c.isCustom),
          avatarEmoji: String(c.avatarEmoji || '✨'),
          updatedAt: Number(c.updatedAt) || Date.now()
        };
      });

      const validSections =
        parsed && Array.isArray(parsed.sections) && parsed.sections.length > 0
          ? parsed.sections
          : undefined;

      const validFilters =
        parsed && parsed.filters && typeof parsed.filters === 'object'
          ? parsed.filters
          : undefined;

      onImportStatus({
        characters: validatedCharacters,
        sections: validSections,
        filters: validFilters
      });

      setStatusMessage({
        type: 'success',
        text: `Successfully imported ${validatedCharacters.length} characters with friendship levels and hangout tasks!`
      });
      setPasteJson('');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Could not parse JSON. Please verify the file or pasted text is valid JSON.'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseAndRestoreJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const total = characters.length;
  const maxed = characters.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed').length;
  const unlocked = characters.filter(c => c.status !== 'locked').length;

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
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💾</span> Export & Import App Status
            </h2>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Backup or restore characters, friendship levels, hangout tasks & DLC sections
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

        {/* Mode Switch Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          padding: '12px 20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('export');
              setStatusMessage(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 700,
              background: activeTab === 'export'
                ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'export' ? '#ffffff' : 'var(--text-secondary)',
              border: activeTab === 'export' ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--border-subtle)'
            }}
          >
            <DownloadIcon size={16} />
            <span>Export Current Status</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('import');
              setStatusMessage(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 700,
              background: activeTab === 'import'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'import' ? '#ffffff' : 'var(--text-secondary)',
              border: activeTab === 'import' ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--border-subtle)'
            }}
          >
            <UploadIcon size={16} />
            <span>Import Status</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status feedback banner */}
          {statusMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: '0.82rem',
              fontWeight: 600,
              background: statusMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.18)'
                : 'rgba(239, 68, 68, 0.18)',
              color: statusMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
              border: statusMessage.type === 'success'
                ? '1px solid rgba(16, 185, 129, 0.4)'
                : '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              {statusMessage.type === 'success' ? '✓ ' : '⚠️ '}
              {statusMessage.text}
            </div>
          )}

          {/* Current App Status Overview */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 14,
            padding: 14,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Current App Status Snapshot
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Characters</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{unlocked} / {total}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Maxed (Lvl 10)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{maxed}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sections / DLCs</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#a855f7' }}>{sections.length}</div>
              </div>
            </div>

            {/* Hangout Tasks Summary Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
              {roles.map(r => (
                <span
                  key={r.id}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: r.bgColor,
                    color: r.color,
                    border: `1px solid ${r.color}40`
                  }}
                >
                  {r.icon} {r.name}: {roleCounts[r.id] || 0}
                </span>
              ))}
            </div>
          </div>

          {activeTab === 'export' ? (
            <>
              {/* Export Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)'
                  }}
                >
                  <DownloadIcon size={18} />
                  <span>Download Status Backup (.json)</span>
                </button>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: copied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: copied ? '#6ee7b7' : 'var(--text-primary)',
                      border: copied ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                      fontSize: '0.84rem',
                      fontWeight: 700
                    }}
                  >
                    {copied ? <CheckIcon size={16} /> : null}
                    <span>{copied ? 'Copied to Clipboard!' : '📋 Copy Status JSON'}</span>
                  </button>

                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      type="button"
                      onClick={handleShareStatus}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.84rem',
                        fontWeight: 700
                      }}
                    >
                      📤 Share
                    </button>
                  )}
                </div>
              </div>

              {/* Raw JSON Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Status Data Preview (Characters, Friendship Levels, Hangout Tasks, Sections)
                </label>
                <textarea
                  readOnly
                  rows={7}
                  value={jsonString}
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Import via File Upload */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px dashed rgba(16, 185, 129, 0.4)',
                borderRadius: 14,
                padding: 16,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Option 1: Load from Backup File (.json)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Select a previously exported status JSON file from your device
                </div>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <UploadIcon size={16} />
                  <span>Choose .json File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Import via Paste JSON */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Option 2: Paste Status JSON Text
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste your exported Dreamlight Valley Companion JSON here..."
                  value={pasteJson}
                  onChange={(e) => setPasteJson(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
                <button
                  type="button"
                  disabled={!pasteJson.trim()}
                  onClick={() => parseAndRestoreJson(pasteJson)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px 16px',
                    borderRadius: 10,
                    background: pasteJson.trim()
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: pasteJson.trim() ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    opacity: pasteJson.trim() ? 1 : 0.6
                  }}
                >
                  <CheckIcon size={16} />
                  <span>Import from Pasted JSON</span>
                </button>
              </div>

              {/* Reset to Defaults */}
              <div style={{
                marginTop: 6,
                paddingTop: 14,
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                flexWrap: 'wrap'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Want to start fresh with default characters & sections?
                </div>
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontSize: '0.76rem',
                      fontWeight: 600
                    }}
                  >
                    <RefreshIcon size={13} />
                    <span>Reset to Defaults</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => {
                        onResetToDefaults();
                        setConfirmReset(false);
                        setStatusMessage({
                          type: 'success',
                          text: 'App data reset to initial default characters and sections.'
                        });
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.76rem'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
