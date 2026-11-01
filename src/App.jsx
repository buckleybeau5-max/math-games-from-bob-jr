import React, { useState, useEffect } from 'react';
import {
  Search,
  Gamepad2,
  Flame,
  Shuffle
} from 'lucide-react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { DecoyOverlay } from './components/DecoyOverlay.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { applyCloak } from './utils/cloak.js';

export default function App() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('playvault_games_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_GAMES;
  });

  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isPanicActive, setIsPanicActive] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('playvault_favorites');
      return saved ? JSON.parse(saved) : ['2048', 'tetris', 'flappy'];
    } catch {
      return ['2048', 'tetris'];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem('playvault_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentCloak, setCurrentCloak] = useState(() => {
    return localStorage.getItem('playvault_cloak') || 'default';
  });

  // Fetch games.json on mount to sync with public/games.json
  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(prev => {
            const customGames = prev.filter(g => g.isCustom);
            const merged = [...data, ...customGames];
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Save games whenever modified
  useEffect(() => {
    localStorage.setItem('playvault_games_catalog', JSON.stringify(games));
  }, [games]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('playvault_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recently played
  useEffect(() => {
    localStorage.setItem('playvault_recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Apply tab cloak on startup
  useEffect(() => {
    applyCloak(currentCloak);
  }, [currentCloak]);

  // Global Panic Key Listener (~ or Esc)
  useEffect(() => {
    let escCount = 0;
    let escTimer = null;

    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsPanicActive(prev => !prev);
      } else if (e.key === 'Escape') {
        escCount++;
        clearTimeout(escTimer);
        if (escCount >= 2) {
          setIsPanicActive(prev => !prev);
          escCount = 0;
        } else {
          escTimer = setTimeout(() => { escCount = 0; }, 400);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, plays: g.plays + 1 } : g));
    setRecentlyPlayed(prev => [game.id, ...prev.filter(id => id !== game.id)].slice(0, 10));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame) => {
    setGames(prev => [newGame, ...prev]);
  };

  const handleImportGames = (imported) => {
    setGames(imported);
  };

  const handleResetDefaults = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem('playvault_games_catalog');
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const random = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(random);
  };

  const categories = ['All', 'Arcade', 'Puzzle', 'Action', 'Classic', 'Retro', 'Sports'];

  const filteredGames = games.filter(game => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.tags && game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeTab === 'favorites') {
      return favorites.includes(game.id);
    }

    if (selectedCategory !== 'All') {
      return game.category === selectedCategory;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.plays - a.plays;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'recent') {
      const idxA = recentlyPlayed.indexOf(a.id);
      const idxB = recentlyPlayed.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    }
    return 0;
  });

  const featuredGame = games.find(g => g.featured) || games[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Panic Decoy Educational Assignment Screen */}
      {isPanicActive && (
        <DecoyOverlay onDismiss={() => setIsPanicActive(false)} />
      )}

      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog' || tab === 'categories') setSelectedGame(null);
        }}
        onPanic={() => setIsPanicActive(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            allGames={games}
            onSelectGame={handleSelectGame}
          />
        ) : activeTab === 'add' ? (
          <AddGameModal
            games={games}
            onAddGame={handleAddGame}
            onImportGames={handleImportGames}
            onResetDefaults={handleResetDefaults}
            onClose={() => setActiveTab('catalog')}
          />
        ) : activeTab === 'cloak' ? (
          <CloakModal
            currentPreset={currentCloak}
            onSelectPreset={(p) => {
              setCurrentCloak(p);
              applyCloak(p);
            }}
            onTriggerPanic={() => setIsPanicActive(true)}
            onClose={() => setActiveTab('catalog')}
          />
        ) : (
          <div className="space-y-8">
            {/* Hero Spotlight */}
            {activeTab === 'catalog' && !searchQuery && selectedCategory === 'All' && featuredGame && (
              <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-lg">
                <div className="relative z-10 max-w-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>Featured Unblocked Title</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{featuredGame.category}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {featuredGame.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>{featuredGame.plays?.toLocaleString?.() || featuredGame.plays} plays</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-medium">★ {featuredGame.rating} Rating</span>
                    <span aria-hidden="true">·</span>
                    <span>No installs required</span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Play Now
                    </button>
                    <button
                      onClick={handleRandomGame}
                      className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                      Random Game
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-10 pointer-events-none">
                  <Gamepad2 className="w-64 h-64 text-amber-400 transform rotate-12" />
                </div>
              </div>
            )}

            {/* Filter, Search & Sorting Controls Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search games, tags, or genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="az">Title A-Z</option>
                    <option value="recent">Recently Played</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = (activeTab === 'favorites' && cat === 'Favorites') ||
                    (activeTab !== 'favorites' && selectedCategory === cat);

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        if (activeTab === 'favorites') setActiveTab('catalog');
                        setSelectedCategory(cat);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activeTab === 'favorites'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  ★ Favorites ({favorites.length})
                </button>
              </div>
            </div>

            {/* Games Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-200">
                    {activeTab === 'favorites'
                      ? 'Your Saved Favorites'
                      : selectedCategory === 'All'
                      ? 'All Unblocked Games'
                      : `${selectedCategory} Games`}
                  </h2>
                  <span className="text-xs text-slate-500">
                    ({filteredGames.length} available)
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Registry: games.json
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                  <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-300">No games found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchQuery
                      ? `No games matched "${searchQuery}". Try a different keyword.`
                      : activeTab === 'favorites'
                      ? "You haven't saved any games to your favorites yet. Click the heart icon on any game card!"
                      : "No games found in this category."}
                  </p>
                  {(searchQuery || selectedCategory !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setActiveTab('catalog');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onSelect={handleSelectGame}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PlayVault</span>
            <span aria-hidden="true">·</span>
            <span>Static HTML/JS/CSS Iframe Game System</span>
            <span aria-hidden="true">·</span>
            <span>Zero Tracking & No AI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('cloak')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Stealth Cloaker
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('add')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              JSON Catalog
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-600">Press ~ for Decoy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
