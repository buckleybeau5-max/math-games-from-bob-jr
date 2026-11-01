import React from 'react';
import { BookOpen, CheckCircle, FileText, ArrowLeft, MoreVertical } from 'lucide-react';

export function DecoyOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#202124] font-sans overflow-y-auto select-none">
      {/* Google Classroom Decoy Top Bar */}
      <div className="bg-white border-b border-[#dadce0] px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#137333] flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#3c4043] leading-tight">
              AP World History: Modern · Period 4
            </h1>
            <p className="text-xs text-[#5f6368]">Mr. Henderson · Room 204</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#5f6368]">Due Today, 11:59 PM</span>
          <button
            onClick={onDismiss}
            title="Return to PlayVault"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[#1a73e8] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Vault</span>
          </button>
        </div>
      </div>

      {/* Assignment Body Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white border border-[#dadce0] rounded-lg p-6 shadow-xs">
          <div className="flex items-start justify-between border-b border-[#dadce0] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-normal text-[#1f1f1f]">
                  Unit 4 DBQ Research & Document Analysis
                </h2>
                <p className="text-xs text-[#5f6368]">100 points · Assigned yesterday</p>
              </div>
            </div>
            <button className="text-[#5f6368] hover:text-[#202124]">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="prose text-sm text-[#3c4043] space-y-4 leading-relaxed font-serif">
            <p>
              <strong>Instructions:</strong> Analyze the secondary sources concerning trans-oceanic maritime routes between 1450 and 1750 CE. Synthesize the economic ramifications of silver circulation from the Americas through the Manila Galleon trade network to Ming dynasty markets.
            </p>
            <div className="bg-[#f8f9fa] border-l-4 border-[#1a73e8] p-4 text-xs font-mono rounded">
              Document A: Excerpt from Antonio de Morga, <em>Sucesos de las Islas Filipinas</em> (Mexico, 1609).
              <br />
              "...the merchants bring much fine silk, raw and woven, porcelain of great perfection, spices, and musk to exchange for bars of silver minted in Potosi..."
            </div>
            <p>
              Formulate a defensible thesis statement establishing how commercial interconnectedness altered state fiscal policies. Provide at least two pieces of contextual evidence and explain the historical perspective of the author.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#dadce0] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#137333] font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Draft autosaved to Google Drive</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-xs font-medium text-[#1a73e8] border border-[#dadce0] rounded hover:bg-[#f8f9fa] cursor-pointer"
              >
                Open Google Doc
              </button>
              <button
                onClick={onDismiss}
                className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] rounded hover:bg-[#155724] transition-colors cursor-pointer"
              >
                Turn in
              </button>
            </div>
          </div>
        </div>

        {/* Reference Links Decoy */}
        <div className="bg-white border border-[#dadce0] rounded-lg p-4 flex items-center justify-between text-xs text-[#5f6368]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1a73e8]" />
            <span>Rubric: AP History Document-Based Question Scoring Guidelines.pdf</span>
          </div>
          <span>Attached PDF (240 KB)</span>
        </div>
      </div>
    </div>
  );
}
