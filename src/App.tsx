import React, { useState, useEffect, useMemo } from 'react';
import { Character, GameSection, FilterOptions } from './types/character';
import { DEFAULT_SECTIONS, STANDARD_ROLES, INITIAL_CHARACTERS } from './data/charactersData';
import { Header } from './components/Header';
import { SectionTabs } from './components/SectionTabs';
import { FilterBar } from './components/FilterBar';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { AddCharacterModal } from './components/AddCharacterModal';
import { AddSectionModal } from './components/AddSectionModal';
import { DailyTrackerModal } from './components/DailyTrackerModal';
import { StatsModal } from './components/StatsModal';
import { BackupModal } from './components/BackupModal';
import { SparklesIcon, PlusIcon } from './components/Icons';

const STORAGE_KEY_CHARS = 'ddv_companion_characters_v1';
const STORAGE_KEY_SECTIONS = 'ddv_companion_sections_v1';

export const App: React.FC = () => {
  // --- Persistent State ---
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading characters from localStorage:', e);
    }
    return INITIAL_CHARACTERS;
  });

  const [sections, setSections] = useState<GameSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading sections from localStorage:', e);
    }
    return DEFAULT_SECTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARS, JSON.stringify(characters));
    } catch (e) {
      console.error('Failed saving characters to storage:', e);
    }
  }, [characters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(sections));
    } catch (e) {
      console.error('Failed saving sections to storage:', e);
    }
  }, [sections]);

  // --- Filter State ---
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    sectionId: 'all',
    role: 'all',
    status: 'all',
    sortBy: 'name'
  });

  // --- Modal States ---
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isAddCharOpen, setIsAddCharOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [backupModalTab, setBackupModalTab] = useState<'export' | 'import' | null>(null);

  // --- Character Handlers ---
  const handleUpdateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates, updatedAt: Date.now() };
        if (updates.friendshipLevel !== undefined && updates.status === undefined) {
          if (updates.friendshipLevel >= 10) {
            updated.status = 'maxed';
          } else if (c.status === 'locked') {
            updated.status = 'unlocked';
          }
        }
        return updated;
      }
      return c;
    }));

    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleSaveCharacterModal = (updated: Character) => {
    handleUpdateCharacter(updated.id, updated);
    setSelectedCharacter(null);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    setSelectedCharacter(null);
  };

  const handleAddCharacter = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    setIsAddCharOpen(false);
  };

  const handleAddSection = (newSection: GameSection) => {
    setSections(prev => [...prev, newSection]);
    setFilters(prev => ({ ...prev, sectionId: newSection.id }));
    setIsAddSectionOpen(false);
  };

  const handleResetDaily = () => {
    if (window.confirm("Reset all daily interactions (daily discussions & gifts) for today?")) {
      setCharacters(prev => prev.map(c => ({
        ...c,
        dailyTalked: false,
        dailyGiftsGiven: 0
      })));
    }
  };

  // --- Backup & Restore ---
  const handleExportData = () => {
    setBackupModalTab('export');
  };

  const handleImportData = () => {
    setBackupModalTab('import');
  };

  const handleApplyImportedStatus = (data: {
    characters: Character[];
    sections?: GameSection[];
    filters?: FilterOptions;
  }) => {
    setCharacters(data.characters);
    if (data.sections && data.sections.length > 0) {
      setSections(data.sections);
    }
    if (data.filters) {
      setFilters(prev => ({ ...prev, ...data.filters }));
    }
  };

  const handleResetToDefaults = () => {
    setCharacters(INITIAL_CHARACTERS);
    setSections(DEFAULT_SECTIONS);
    setFilters({
      searchQuery: '',
      sectionId: 'all',
      role: 'all',
      status: 'all',
      sortBy: 'name'
    });
  };

  // --- Filtered and Sorted Characters ---
  const filteredCharacters = useMemo(() => {
    let result = [...characters];

    // Filter by Section
    if (filters.sectionId !== 'all') {
      result = result.filter(c => c.sectionId === filters.sectionId);
    }

    // Filter by Role
    if (filters.role !== 'all') {
      result = result.filter(c => c.role === filters.role);
    }

    // Filter by Status
    if (filters.status !== 'all') {
      if (filters.status === 'in_progress') {
        result = result.filter(c => c.status === 'unlocked' && c.friendshipLevel < 10);
      } else if (filters.status === 'maxed') {
        result = result.filter(c => c.friendshipLevel >= 10 || c.status === 'maxed');
      } else {
        result = result.filter(c => c.status === filters.status);
      }
    }

    // Filter by Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.universe.toLowerCase().includes(q) ||
        (c.houseLocation && c.houseLocation.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    // Sort By
    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'level-desc') {
        return b.friendshipLevel - a.friendshipLevel;
      } else if (filters.sortBy === 'level-asc') {
        return a.friendshipLevel - b.friendshipLevel;
      } else if (filters.sortBy === 'universe') {
        return a.universe.localeCompare(b.universe) || a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'role') {
        return a.role.localeCompare(b.role) || a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [characters, filters]);

  // Current section details
  const currentSection = sections.find(s => s.id === filters.sectionId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        characters={characters}
        onOpenAddModal={() => setIsAddCharOpen(true)}
        onOpenDailyModal={() => setIsDailyModalOpen(true)}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetDaily={handleResetDaily}
      />

      {/* Base Game & DLC Sections Tabs */}
      <SectionTabs
        sections={sections}
        activeSectionId={filters.sectionId}
        onSelectSection={(id) => setFilters(prev => ({ ...prev, sectionId: id }))}
        characters={characters}
        onOpenAddSectionModal={() => setIsAddSectionOpen(true)}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onChangeFilters={(updated) => setFilters(prev => ({ ...prev, ...updated }))}
        roles={STANDARD_ROLES}
        totalVisible={filteredCharacters.length}
      />

      {/* Main Content Area: Character Grid */}
      <main style={{
        flex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '8px 16px 80px'
      }}>
        {currentSection && filters.sectionId !== 'all' && (
          <div style={{
            marginBottom: 16,
            padding: '12px 16px',
            borderRadius: 14,
            background: currentSection.badgeBg,
            border: `1px solid ${currentSection.color}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.8rem' }}>{currentSection.icon}</span>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: currentSection.color }}>
                  {currentSection.name}
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {currentSection.subtitle}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAddCharOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 8,
                background: currentSection.color,
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <PlusIcon size={14} />
              <span>Add to {currentSection.name}</span>
            </button>
          </div>
        )}

        {filteredCharacters.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 20,
            border: '1px dashed var(--border-subtle)',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✨</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>
              No Characters Found
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 18px' }}>
              No villagers match your current filters. Try searching with a different term, clear filters, or add a new character!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button
                onClick={() => setFilters({ searchQuery: '', sectionId: 'all', role: 'all', status: 'all', sortBy: 'name' })}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsAddCharOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                <PlusIcon size={16} />
                <span>Add Character</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 14
          }}>
            {filteredCharacters.map(char => {
              const sec = sections.find(s => s.id === char.sectionId);
              const roleInfo = STANDARD_ROLES.find(r => r.id === char.role);

              return (
                <CharacterCard
                  key={char.id}
                  character={char}
                  section={sec}
                  roleInfo={roleInfo}
                  roles={STANDARD_ROLES}
                  onUpdateCharacter={handleUpdateCharacter}
                  onSelectCharacter={setSelectedCharacter}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button for mobile */}
      <button
        onClick={() => setIsAddCharOpen(true)}
        title="Add Character"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--safe-bottom) + 20px)',
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(168, 85, 247, 0.5)',
          zIndex: 40,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <PlusIcon size={26} />
      </button>

      {/* Modals */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          sections={sections}
          roles={STANDARD_ROLES}
          onClose={() => setSelectedCharacter(null)}
          onSave={handleSaveCharacterModal}
          onDelete={handleDeleteCharacter}
        />
      )}

      {isAddCharOpen && (
        <AddCharacterModal
          sections={sections}
          roles={STANDARD_ROLES}
          defaultSectionId={filters.sectionId}
          onClose={() => setIsAddCharOpen(false)}
          onAdd={handleAddCharacter}
        />
      )}

      {isAddSectionOpen && (
        <AddSectionModal
          onClose={() => setIsAddSectionOpen(false)}
          onAdd={handleAddSection}
        />
      )}

      {isDailyModalOpen && (
        <DailyTrackerModal
          characters={characters}
          roles={STANDARD_ROLES}
          onClose={() => setIsDailyModalOpen(false)}
          onUpdateCharacter={handleUpdateCharacter}
          onResetDaily={handleResetDaily}
        />
      )}

      {isStatsModalOpen && (
        <StatsModal
          characters={characters}
          sections={sections}
          roles={STANDARD_ROLES}
          onClose={() => setIsStatsModalOpen(false)}
        />
      )}

      {backupModalTab && (
        <BackupModal
          characters={characters}
          sections={sections}
          roles={STANDARD_ROLES}
          filters={filters}
          initialTab={backupModalTab}
          onClose={() => setBackupModalTab(null)}
          onImportStatus={handleApplyImportedStatus}
          onResetToDefaults={handleResetToDefaults}
        />
      )}
    </div>
  );
};

export default App;
