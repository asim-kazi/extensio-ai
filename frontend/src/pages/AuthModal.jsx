import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) await register(email, password);
      else await login(email, password);
      onSuccess();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full backdrop-blur-sm bg-[#0b0f19]/80 flex justify-center items-center z-[2000] animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#171c28] p-10 rounded-2xl w-full max-w-[400px] shadow-2xl border border-slate-700/50 animate-pop-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-transparent text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <h2 className="m-0 mb-2 text-white text-2xl font-bold">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="m-0 text-slate-400 text-sm">
            {isRegister
              ? 'Start building extensions today.'
              : 'Sign in to access your extensions.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-indigo-600 text-white border-none rounded-xl text-base font-bold cursor-pointer hover:bg-indigo-500 transition-colors disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="bg-transparent border-none text-slate-400 text-sm cursor-pointer font-medium hover:text-white transition-colors"
          >
            {isRegister
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
