import React, { useState } from 'react';
import { Download, Upload, Plus, RotateCcw, Check, AlertCircle } from 'lucide-react';

export function AddGameModal({
  games,
  onAddGame,
  onImportGames,
  onResetDefaults,
  onClose
}) {
  const [title, setTitle] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [controls, setControls] = useState('Arrow keys, Space to interact');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Arcade, Fun, Web');
  const [themeColor, setThemeColor] = useState('#f59e0b');
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframeUrl.trim()) {
      setStatusMsg({ type: 'error', text: 'Title and iframe URL are required.' });
      return;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || `Play ${title.trim()} unblocked in high performance mode.`,
      iframeUrl: iframeUrl.trim(),
      controls: controls.trim() || 'Keyboard and mouse controls',
      rating: 5.0,
      plays: 1,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      featured: false,
      themeColor,
      isCustom: true
    };

    onAddGame(newGame);
    setStatusMsg({ type: 'success', text: `Added "${newGame.title}" to games catalog!` });
    setTitle('');
    setIframeUrl('');
    setDescription('');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "games.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].iframeUrl) {
          onImportGames(parsed);
          setStatusMsg({ type: 'success', text: `Imported ${parsed.length} games successfully!` });
        } else {
          setStatusMsg({ type: 'error', text: 'Invalid JSON format. Expected an array of game objects with title and iframeUrl.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to parse JSON file. Please check syntax.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Games & JSON Catalog Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Store, import, export, or add new game iframes to your local catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export games.json</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={onResetDefaults}
            title="Reset to original games list"
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Add Custom Game Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            Add Game to JSON Catalog
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Game Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Retro Space Blaster"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Iframe Source URL or File Path
            </label>
            <input
              type="text"
              required
              placeholder="e.g. /games/custom.html or https://..."
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Enter a relative path (e.g. /games/2048.html) or external embed URL.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Classic">Classic</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Accent Color</label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full h-9 p-1 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Controls Description</label>
            <input
              type="text"
              placeholder="e.g. WASD to move, Space to jump"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="Action, Platformer, Speed"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="Brief overview of gameplay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
          >
            Save Game Entry
          </button>
        </form>

        {/* Live Catalog JSON Preview */}
        <div className="space-y-3 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Current Catalog JSON ({games.length} Games)
              </h3>
              <span className="text-xs text-slate-400 font-mono">games.json</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              This reflects the active JSON array loaded into the app's iframe registry.
            </p>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-[11px] text-amber-300/80 max-h-[380px] overflow-y-auto">
              <pre>{JSON.stringify(games, null, 2)}</pre>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Done & Return to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
