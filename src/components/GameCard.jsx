import React from 'react';
import { Play, Heart } from 'lucide-react';

export function GameCard({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite
}) {
  const formatPlays = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const color = game.themeColor || '#f59e0b';

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer overflow-hidden p-4 shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Game Visual / Banner Thumbnail */}
        <div
          className="relative aspect-video w-full rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-800/80"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, ${color}22 100%)`
          }}
        >
          {/* Subtle glowing orb */}
          <div
            className="absolute w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity"
            style={{ backgroundColor: color }}
          />

          {/* Central Stylized Title Lettering / Badge */}
          <div className="relative z-10 flex flex-col items-center text-center p-2">
            <span
              className="text-2xl font-black tracking-tight drop-shadow-md group-hover:scale-105 transition-transform"
              style={{ color }}
            >
              {game.title.split(' ')[0]}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              {game.title.split(' ').slice(1).join(' ') || 'Game'}
            </span>
          </div>

          {/* Play Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-slate-300">{game.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatPlays(game.plays)} plays</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400 font-medium">★ {Number(game.rating).toFixed(1)}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {game.description}
        </p>
      </div>

      {/* Controls summary footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[200px]" title={game.controls}>
          {game.controls}
        </span>
        <span className="text-amber-400 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Play <Play className="w-2.5 h-2.5 fill-current" />
        </span>
      </div>
    </div>
  );
}
