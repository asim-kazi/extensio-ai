import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Extensio</h2>
          <p style={styles.subtitle}>
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={styles.switchBtn}
          >
            {isRegister ? 'Sign in instead' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: {
    margin: '0 0 8px 0',
    color: '#6366f1',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: { margin: 0, color: '#64748b', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column' },
  label: {
    marginBottom: '6px',
    color: '#334155',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  primaryBtn: {
    padding: '14px',
    backgroundColor: '#0f172a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  footerText: { margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#6366f1',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
};
