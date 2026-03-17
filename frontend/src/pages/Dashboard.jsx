import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await api.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Extensions</h1>
        <div>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
          <Link to="/editor" style={{ textDecoration: 'none' }}>
            <button style={styles.primaryBtn}>+ New Extension</button>
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={styles.emptyState}>
          <p>You haven't created any extensions yet!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map((p) => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.name}</h3>
              <p style={styles.cardDesc}>
                {p.description?.length > 80
                  ? p.description.substring(0, 80) + '...'
                  : p.description}
              </p>

              <div style={styles.cardActions}>
                <Link to={`/editor/${p.id}`}>
                  <button style={styles.editBtn}>Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1000px',
    margin: '0 auto 30px auto',
  },
  title: { color: '#1e293b', margin: 0 },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    color: '#64748b',
    cursor: 'pointer',
    marginRight: '12px',
    fontWeight: '500',
  },
  primaryBtn: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: '50px',
    fontSize: '18px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: { margin: '0 0 10px 0', color: '#0f172a', fontSize: '18px' },
  cardDesc: {
    margin: '0 0 20px 0',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
    flexGrow: 1,
  },
  cardActions: { display: 'flex', gap: '10px' },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: '8px 16px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};
