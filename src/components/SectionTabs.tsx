import React from 'react';
import { GameSection, Character } from '../types/character';
import { PlusIcon } from './Icons';

interface SectionTabsProps {
  sections: GameSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  characters: Character[];
  onOpenAddSectionModal: () => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  characters,
  onOpenAddSectionModal
}) => {
  const getSectionCount = (sectionId: string) => {
    if (sectionId === 'all') return characters.length;
    return characters.filter(c => c.sectionId === sectionId).length;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      overflowX: 'auto',
      padding: '12px 16px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(15, 23, 42, 0.4)'
    }}>
      {/* 'All' Tab */}
      <button
        onClick={() => onSelectSection('all')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 999,
          fontSize: '0.82rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          background: activeSectionId === 'all' 
            ? 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)' 
            : 'rgba(255, 255, 255, 0.05)',
          color: activeSectionId === 'all' ? '#ffffff' : 'var(--text-secondary)',
          border: activeSectionId === 'all' 
            ? '1px solid rgba(255, 255, 255, 0.3)' 
            : '1px solid var(--border-subtle)',
          boxShadow: activeSectionId === 'all' ? '0 2px 10px rgba(147, 51, 234, 0.4)' : 'none'
        }}
      >
        <span>🌟 All Characters</span>
        <span style={{
          padding: '2px 6px',
          borderRadius: 999,
          fontSize: '0.7rem',
          background: activeSectionId === 'all' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          color: activeSectionId === 'all' ? '#ffffff' : 'var(--text-muted)'
        }}>
          {getSectionCount('all')}
        </span>
      </button>

      {/* Dynamic Sections (Base game, DLCs) */}
      {sections.map(section => {
        const isActive = activeSectionId === section.id;
        const count = getSectionCount(section.id);

        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: '0.82rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: isActive ? section.badgeBg : 'rgba(255, 255, 255, 0.05)',
              color: isActive ? section.color : 'var(--text-secondary)',
              border: isActive ? `1px solid ${section.color}` : '1px solid var(--border-subtle)',
              boxShadow: isActive ? `0 2px 10px ${section.badgeBg}` : 'none'
            }}
          >
            <span>{section.icon}</span>
            <span>{section.name}</span>
            <span style={{
              padding: '2px 6px',
              borderRadius: 999,
              fontSize: '0.7rem',
              background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: isActive ? '#ffffff' : 'var(--text-muted)'
            }}>
              {count}
            </span>
          </button>
        );
      })}

      {/* Add New Section / DLC button */}
      <button
        onClick={onOpenAddSectionModal}
        title="Add Custom Section or DLC"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '8px 12px',
          borderRadius: 999,
          fontSize: '0.8rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px dashed var(--border-subtle)'
        }}
      >
        <PlusIcon size={14} />
        <span>New DLC/Section</span>
      </button>
    </div>
  );
};
