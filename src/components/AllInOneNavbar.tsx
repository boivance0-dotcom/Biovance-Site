import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsSheet from '@/components/SettingsSheet';
import { Settings } from 'lucide-react';

export type SearchType = 'all' | 'images' | 'videos' | 'news' | 'maps';

interface AllInOneNavbarProps {
  selectedType: SearchType;
  onTypeChange: (next: SearchType) => void;
  safeSearch?: boolean;
  onSafeSearchChange?: (next: boolean) => void;
}

const TYPE_TABS: Array<{ key: SearchType; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'images', label: 'Images' },
  { key: 'videos', label: 'Videos' },
  { key: 'news', label: 'News' },
  { key: 'maps', label: 'Maps' },
];

const AllInOneNavbar: React.FC<AllInOneNavbarProps> = ({ selectedType, onTypeChange, safeSearch, onSafeSearchChange }) => {
  const [localSafe, setLocalSafe] = useState<boolean>(() => {
    try { const v = localStorage.getItem('safeSearch'); return v ? JSON.parse(v) : true; } catch { return true; }
  });

  useEffect(() => {
    if (typeof safeSearch === 'boolean') setLocalSafe(safeSearch);
  }, [safeSearch]);

  useEffect(() => {
    try { localStorage.setItem('safeSearch', JSON.stringify(localSafe)); } catch {}
    onSafeSearchChange?.(localSafe);
  }, [localSafe, onSafeSearchChange]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <nav className="mx-auto max-w-7xl h-16 px-4 md:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="min-w-[140px] flex items-center">
          <Link to="/search" className="font-extrabold tracking-tight text-lg md:text-xl text-gray-900">Zytherion Biovance</Link>
        </div>
        {/* Center: Type tabs */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm">
            {TYPE_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTypeChange(tab.key)}
                className={`px-3 py-1.5 rounded-full border ${selectedType === tab.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white/70 text-gray-800 border-gray-300 hover:bg-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Safe Search + Settings */}
        <div className="min-w-[180px] flex items-center justify-end gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <span>Safe Search</span>
            <input
              type="checkbox"
              checked={localSafe}
              onChange={(e) => setLocalSafe(e.target.checked)}
              className="h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-blue-600 relative transition-colors cursor-pointer"
              aria-label="Safe Search"
            />
          </label>
          <SettingsSheet>
            <button aria-label="Settings" className="h-10 w-10 grid place-items-center rounded-full border border-gray-300 text-gray-800 hover:bg-white">
              <Settings className="h-5 w-5" />
            </button>
          </SettingsSheet>
        </div>
      </nav>
    </header>
  );
};

export default AllInOneNavbar;