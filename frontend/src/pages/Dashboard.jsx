import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import EditorModal from './EditorModal';
import ProgressViewer from './ProgressViewer';
import AuthModal from './AuthModal';
import UpgradeModal from './UpgradeModal';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [appState, setAppState] = useState('hero');
  const [genStatus, setGenStatus] = useState('idle');

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      api
        .get('/projects')
        .then((res) => setProjects(res.data))
        .catch(() => {});
    } else {
      setProjects([]);
    }
  }, [user]);

  const handleCTA = () => {
    if (!user) setShowAuthModal(true);
    else setShowEditorModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowEditorModal(true);
  };

  const handleUpgradeClick = () => {
    if (!user)
      setShowAuthModal(true); // Must log in to upgrade
    else setShowUpgradeModal(true);
  };

  const handleGenerate = async ({ name, prompt }) => {
    setAppState('generating');
    setGenStatus('thinking');

    try {
      setTimeout(() => setGenStatus('generating'), 1500);

      const res = await api.post(
        '/generate',
        { projectName: name, prompt },
        { responseType: 'blob' },
      );

      setGenStatus('zipping');

      setTimeout(() => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        setGenStatus('done');
        api.get('/projects').then((res) => setProjects(res.data));

        setTimeout(() => setAppState('success'), 1500);
      }, 1000);
    } catch (err) {
      if (err.response?.status === 403) {
        setShowUpgradeModal(true);
      } else {
        alert('Error: ' + (err.response?.data?.error || err.message));
      }
      setAppState('hero');
      setGenStatus('idle');
    }
  };

  const handleHomeClick = () => {
    setAppState('hero');
    setGenStatus('idle');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0f19] overflow-hidden font-sans text-slate-200">
      <header className="h-[70px] px-8 bg-[#0b0f19]/80 backdrop-blur-lg flex justify-between items-center border-b border-slate-800/80 shadow-sm shrink-0 z-20">
        <div
          onClick={handleHomeClick}
          className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            ✦
          </div>
          Extensio
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleUpgradeClick}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl cursor-pointer font-bold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
          >
            🚀 Upgrade
          </button>

          {!user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2.5 bg-white text-slate-900 rounded-xl cursor-pointer font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
            >
              Log In / Sign Up
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-transparent text-slate-400 border border-slate-700 rounded-xl cursor-pointer font-bold text-sm hover:text-white hover:bg-slate-800 transition-colors"
            >
              Log Out
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar projects={projects} setProjects={setProjects} user={user} />

        <main className="flex-1 flex justify-center items-center p-10 overflow-y-auto relative bg-[#0b0f19]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          {appState === 'hero' && (
            <div className="max-w-3xl text-center animate-slide-up relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-400 font-semibold text-sm tracking-wide">
                ✨ AI-Powered Extension Builder
              </div>
              <h1 className="text-5xl md:text-6xl text-white mb-6 font-black leading-tight tracking-tight">
                Build Chrome Extensions in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Seconds
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                Describe your idea in plain English. Our AI will write the code,
                package the files, and deliver a ready-to-use ZIP file
                instantly.
                <span className="block mt-2 text-slate-300 font-bold">
                  No coding required.
                </span>
              </p>
              <button
                onClick={handleCTA}
                className="group px-8 py-4 text-lg bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:-translate-y-1 hover:shadow-indigo-600/40 transition-all flex items-center gap-3 mx-auto"
              >
                Get Started → Create Extension
              </button>
            </div>
          )}

          {appState === 'generating' && <ProgressViewer status={genStatus} />}

          {appState === 'success' && (
            <div className="max-w-2xl w-full text-center animate-pop-in relative z-10 mt-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-4xl border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                🎉
              </div>
              <h1 className="text-3xl md:text-4xl text-white mb-3 font-extrabold tracking-tight">
                Ready for Launch!
              </h1>
              <p className="text-base text-slate-400 mb-8 leading-relaxed">
                Your extension has been downloaded securely. Follow these quick
                steps to install it:
              </p>

              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-6 mb-8 text-left backdrop-blur-md shadow-xl mx-auto max-w-lg">
                <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-lg">
                  <span className="text-indigo-400 text-xl">⚙️</span>{' '}
                  Installation Guide
                </h3>
                <ul className="space-y-4 text-slate-300 text-sm font-medium">
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-indigo-500/30">
                      1
                    </div>
                    <span className="mt-0.5">
                      <strong className="text-white">Extract</strong> the
                      downloaded ZIP file to a new folder on your computer.
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-indigo-500/30">
                      2
                    </div>
                    <span className="mt-0.5">
                      Open Google Chrome and go to{' '}
                      <code className="bg-slate-900 px-2 py-1 rounded-md border border-slate-700 text-indigo-300 select-all font-mono text-xs">
                        chrome://extensions/
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-indigo-500/30">
                      3
                    </div>
                    <span className="mt-0.5">
                      Turn on{' '}
                      <strong className="text-white">Developer mode</strong>{' '}
                      (the toggle switch in the top right corner).
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-indigo-500/30">
                      4
                    </div>
                    <span className="mt-0.5">
                      Click the{' '}
                      <strong className="text-white">Load unpacked</strong>{' '}
                      button and select your extracted folder.
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setAppState('hero')}
                className="px-8 py-3.5 text-base bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
              >
                + Create Another Extension
              </button>
            </div>
          )}
        </main>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
      {showEditorModal && (
        <EditorModal
          onClose={() => setShowEditorModal(false)}
          onSubmit={handleGenerate}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={user?.subscriptionStatus || 'free'}
        />
      )}
    </div>
  );
}
