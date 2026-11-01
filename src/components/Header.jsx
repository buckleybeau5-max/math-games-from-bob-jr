import React from 'react';
import { Gamepad2, ShieldAlert } from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  onPanic,
  favoritesCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="font-extrabold tracking-tight">PlayVault</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'catalog' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'categories' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'favorites' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Favorites {favoritesCount > 0 && `(${favoritesCount})`}
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'add' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Add Game & JSON
          </button>
          <button
            onClick={() => setActiveTab('cloak')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'cloak' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Tab Disguise
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPanic}
            title="Instant Tab Cloak (Hotkey: ~ or Esc)"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-200 bg-rose-500/15 border border-rose-500/30 rounded-lg hover:bg-rose-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Panic Decoy (~ key)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
