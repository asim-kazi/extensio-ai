import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Naya State Error handle karne ke liye

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Purane errors clear karo

    // Client-side Validation
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }
    if (isRegister && password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (!email.includes('@') || !email.includes('.')) {
      return setError('Please enter a valid email address.');
    }

    setLoading(true);
    try {
      if (isRegister) await register(email, password);
      else await login(email, password);
      onSuccess();
    } catch (err) {
      // Backend error ko alert ki jagah state mein set karo
      setError(
        err.response?.data?.error ||
          err.message ||
          'Authentication failed. Please try again.',
      );
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
        className="bg-[#171c28] p-10 rounded-3xl w-full max-w-[400px] shadow-2xl border border-slate-700/50 animate-pop-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-transparent text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20 mb-4">
            ✦
          </div>
          <h2 className="m-0 mb-2 text-white text-2xl font-bold">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="m-0 text-slate-400 text-sm font-medium">
            {isRegister
              ? 'Start building extensions today.'
              : 'Sign in to access your extensions.'}
          </p>
        </div>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
            <span className="text-red-400 mt-0.5 text-sm">⚠️</span>
            <p className="m-0 text-red-300 text-sm font-medium leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full px-5 py-3.5 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full px-5 py-3.5 rounded-xl bg-[#0b0f19] border border-slate-700 text-white placeholder-slate-500 text-[15px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-indigo-600 text-white border-none rounded-xl text-base font-bold cursor-pointer hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : isRegister ? (
              'Sign Up'
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-5 border-t border-slate-800">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
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
