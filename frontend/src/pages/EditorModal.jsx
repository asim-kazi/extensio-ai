import { useState } from 'react';

export default function EditorModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!name || !prompt) return;
    onSubmit({ name, prompt });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full backdrop-blur-sm bg-[#0b0f19]/80 flex justify-center items-center z-[1000] animate-fade-in p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-[#171c28] p-8 rounded-2xl w-full max-w-[500px] shadow-2xl border border-slate-700/50 animate-pop-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 mb-2 text-white text-2xl font-bold">Create New Extension</h2>
        <p className="m-0 mb-6 text-slate-400 text-sm">
          Describe what you want to build, and AI will do the rest.
        </p>

        <input
          placeholder="Extension Name (e.g., Color Picker)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />

        <textarea
          placeholder="Describe the functionality in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 mb-6 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-transparent text-slate-400 font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name || !prompt}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Now ✨
          </button>
        </div>
      </div>
    </div>
  );
}