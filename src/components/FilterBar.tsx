import React from 'react';
import { FilterOptions, CharacterRoleInfo } from '../types/character';
import { SearchIcon, FilterIcon, CloseIcon } from './Icons';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (updated: Partial<FilterOptions>) => void;
  roles: CharacterRoleInfo[];
  totalVisible: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  roles,
  totalVisible
}) => {
  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.role !== 'all' || 
    filters.status !== 'all' || 
    filters.sortBy !== 'name';

  const clearFilters = () => {
    onChangeFilters({
      searchQuery: '',
      role: 'all',
      status: 'all',
      sortBy: 'name'
    });
  };

  return (
    <div style={{
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 1200,
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Search Input Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none' }}>
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            placeholder="Search characters (e.g. Mickey, Moana, Lion King)..."
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ searchQuery: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 36px 10px 38px',
              borderRadius: 12,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem'
            }}
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ searchQuery: '' })}
              style={{
                position: 'absolute',
                right: 10,
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: 4
              }}
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.78rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Filter Selectors Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: 2
      }}>
        {/* Role Selector */}
        <select
          value={filters.role}
          onChange={(e) => onChangeFilters({ role: e.target.value })}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: 'var(--bg-surface)',
            border: filters.role !== 'all' ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
            color: filters.role !== 'all' ? '#e9d5ff' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <option value="all">Task: All Roles</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>
              {r.icon} {r.name}
            </option>
          ))}
        </select>

        {/* Status Selector */}
        <select
          value={filters.status}
          onChange={(e) => onChangeFilters({ status: e.target.value })}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: 'var(--bg-surface)',
            border: filters.status !== 'all' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            color: filters.status !== 'all' ? '#fef08a' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <option value="all">Friendship: All</option>
          <option value="in_progress">In Progress (Lvl 1-9)</option>
          <option value="maxed">Maxed (Lvl 10) ⭐</option>
          <option value="locked">Locked 🔒</option>
          <option value="unlocked">Unlocked</option>
        </select>

        {/* Sort By Selector */}
        <select
          value={filters.sortBy}
          onChange={(e) => onChangeFilters({ sortBy: e.target.value as any })}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <option value="name">Sort: Name (A-Z)</option>
          <option value="level-desc">Sort: Level (High to Low)</option>
          <option value="level-asc">Sort: Level (Low to High)</option>
          <option value="universe">Sort: Franchise / Universe</option>
          <option value="role">Sort: Assigned Task</option>
        </select>

        <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {totalVisible} found
        </div>
      </div>
    </div>
  );
};
