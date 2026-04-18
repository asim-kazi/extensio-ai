import { useState } from 'react';
import api from '../services/api';

export default function UpgradeModal({ onClose, currentPlan = 'free' }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan) => {
    if (plan === currentPlan) return; // Cannot upgrade to current plan

    setLoading(true);
    try {
      await api.post('/subscription/upgrade', { plan });
      alert(`🎉 Upgraded to ${plan.toUpperCase()} successfully!`);
      window.location.reload(); // Refresh to update user session context
    } catch (err) {
      alert('Error upgrading: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full backdrop-blur-md bg-[#0b0f19]/80 flex justify-center items-center z-[3000] animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#171c28] p-10 rounded-3xl w-full max-w-[900px] shadow-2xl border border-slate-700/50 animate-pop-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl text-white font-black mb-3 tracking-tight">
            Upgrade your plan
          </h2>
          <p className="text-slate-400 font-medium">
            Choose the plan that best fits your extension building needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE PLAN */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all">
            <h3 className="text-xl text-slate-300 font-bold mb-2">Free</h3>
            <div className="text-3xl text-white font-black mb-6">
              $0
              <span className="text-base text-slate-500 font-medium">/mo</span>
            </div>
            <ul className="text-slate-400 text-sm space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> 1 Extension limit
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Standard AI
                generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Basic templates
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('free')}
              disabled={currentPlan === 'free' || loading}
              className="w-full py-3 rounded-xl font-bold transition-all bg-slate-700 text-slate-300 disabled:opacity-50 cursor-pointer hover:bg-slate-600 disabled:cursor-not-allowed"
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* PLUS PLAN */}
          <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/40 border border-indigo-500/50 rounded-2xl p-6 flex flex-col relative transform md:-translate-y-4 shadow-xl shadow-indigo-500/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Recommended
            </div>
            <h3 className="text-xl text-indigo-400 font-bold mb-2">Plus</h3>
            <div className="text-3xl text-white font-black mb-6">
              $9
              <span className="text-base text-slate-500 font-medium">/mo</span>
            </div>
            <ul className="text-slate-300 text-sm space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> 2 Extensions limit
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> Fast generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> Version history
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('plus')}
              disabled={currentPlan === 'plus' || loading}
              className="w-full py-3 rounded-xl font-bold transition-all bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
            >
              {loading
                ? 'Processing...'
                : currentPlan === 'plus'
                  ? 'Current Plan'
                  : 'Upgrade to Plus'}
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-all">
            <h3 className="text-xl text-purple-400 font-bold mb-2">Pro</h3>
            <div className="text-3xl text-white font-black mb-6">
              $19
              <span className="text-base text-slate-500 font-medium">/mo</span>
            </div>
            <ul className="text-slate-400 text-sm space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Unlimited Extensions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Advanced APIs & Hooks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> Priority Support
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={currentPlan === 'pro' || loading}
              className="w-full py-3 rounded-xl font-bold transition-all bg-purple-600 text-white cursor-pointer hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Processing...'
                : currentPlan === 'pro'
                  ? 'Current Plan'
                  : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
