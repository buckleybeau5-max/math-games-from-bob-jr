import React from 'react';
import { Shield, Check, EyeOff, HelpCircle } from 'lucide-react';
import { CLOAK_PRESETS } from '../utils/cloak.js';

export function CloakModal({
  currentPreset,
  onSelectPreset,
  onTriggerPanic,
  onClose
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Tab Disguise & Stealth Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantly camouflage your browser tab title and favicon to appear as an educational tool.
          </p>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLOAK_PRESETS.map((preset) => {
          const isSelected = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-slate-100 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 p-1.5">
                <img
                  src={preset.favicon}
                  alt={preset.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-100">{preset.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate font-mono">
                  Tab: "{preset.title}"
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panic Key Action Box */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-rose-400" />
              Panic Hotkey Decoy Screen
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-400 font-bold">~</kbd> (Tilde key) or double-pressing <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-400 font-bold">Esc</kbd> replaces the entire screen with an authentic AP History Google Classroom assignment immediately.
            </p>
          </div>

          <button
            onClick={onTriggerPanic}
            className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-lg hover:bg-rose-500/30 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Test Panic Decoy Now
          </button>
        </div>
      </div>

      {/* Stealth Guidelines */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Pro-Tips for Unblocked Play
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
          <li>Use <strong>About:Blank Cloak</strong> on any game page to launch the game inside an un-trackable about:blank tab.</li>
          <li>All games run completely offline and locally from the embedded JSON registry, requiring no external CDNs or unblocked proxies.</li>
          <li>Press <kbd className="px-1 bg-slate-800 rounded font-mono text-slate-300 font-semibold">~</kbd> whenever you need to instantly hide the game viewport.</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
}
