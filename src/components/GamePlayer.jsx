import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RotateCw,
  Heart,
  ExternalLink,
  Tv,
  Gamepad2,
  Code2
} from 'lucide-react';

export function GamePlayer({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame
}) {
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showJsonSnippet, setShowJsonSnippet] = useState(false);
  const playerContainerRef = useRef(null);

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleAboutBlankCloak = () => {
    try {
      const newWin = window.open('about:blank', '_blank');
      if (newWin) {
        newWin.document.title = game.title;
        newWin.document.body.style.margin = '0';
        newWin.document.body.style.height = '100vh';
        newWin.document.body.style.overflow = 'hidden';
        newWin.document.body.style.backgroundColor = '#000';

        const iframe = newWin.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.margin = '0';
        iframe.allow = 'autoplay; fullscreen; gamepad';
        iframe.src = window.location.origin + game.iframeUrl;
        newWin.document.body.appendChild(iframe);
      }
    } catch (e) {
      window.open(game.iframeUrl, '_blank');
    }
  };

  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top breadcrumb & action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Games</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Unboxed category metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mr-2">
            <span>{game.category}</span>
            <span aria-hidden="true">·</span>
            <span>{game.plays?.toLocaleString?.() || game.plays} plays</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
          </div>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleAboutBlankCloak}
            title="Open game in clean about:blank tab (prevents web filters tracking URL)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>About:Blank Cloak</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Player Viewport */}
      <div
        ref={playerContainerRef}
        className={`relative flex flex-col bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
          isTheater ? 'w-full' : 'max-w-5xl mx-auto'
        }`}
      >
        {/* Iframe Control Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm text-slate-100">{game.title}</span>
            <span className="hidden sm:inline text-xs text-slate-400">
              ({game.iframeUrl})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReload}
              title="Restart game iframe"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTheater(!isTheater)}
              title={isTheater ? "Exit Theater Mode" : "Theater Mode"}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isTheater ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              title="Full Screen Mode"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[720px] min-h-[460px] bg-slate-950 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-medium">Launching {game.title} iframe...</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0 select-none"
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Player Bottom Quick Controls Strip */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-300">{game.controls}</span>
          </div>
          <span className="hidden sm:inline text-slate-400">Click inside frame to focus controls</span>
        </div>
      </div>

      {/* Game Details & JSON Inspector Section */}
      <div className={`space-y-6 ${isTheater ? 'w-full' : 'max-w-5xl mx-auto'}`}>
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{game.title}</h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {game.description}
              </p>
            </div>
            <button
              onClick={() => setShowJsonSnippet(!showJsonSnippet)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showJsonSnippet ? 'Hide JSON Entry' : 'View JSON Entry'}</span>
            </button>
          </div>

          {/* Tags list */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-300">Tags:</span>
            {game.tags?.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {idx < game.tags.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>

          {/* JSON raw representation */}
          {showJsonSnippet && (
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300/90 overflow-x-auto">
              <pre>{JSON.stringify(game, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* More Games Recommendations */}
        {relatedGames.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              More Games to Try
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedGames.map(rg => (
                <button
                  key={rg.id}
                  onClick={() => onSelectGame(rg)}
                  className="p-3 text-left rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 line-clamp-1">
                    {rg.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                    <span>{rg.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400">★ {rg.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
