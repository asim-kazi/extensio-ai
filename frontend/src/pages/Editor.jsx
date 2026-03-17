import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [projectName, setProjectName] = useState('');

  // Replaced 'loading' with a detailed status string
  const [status, setStatus] = useState('idle'); // 'idle' | 'generating' | 'downloading' | 'success'

  useEffect(() => {
    if (projectId) {
      api.get(`/projects/${projectId}`).then((res) => {
        setProjectName(res.data.name);
      });
    }
  }, [projectId]);

  const handleGenerate = async () => {
    setStatus('generating');
    try {
      const response = await api.post(
        '/generate',
        {
          prompt,
          projectName,
          projectId: projectId || undefined,
        },
        { responseType: 'blob' },
      );

      setStatus('downloading'); // Tell the user the AI is done, now we download

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName || 'extension'}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('success'); // Show a success state!

      // Wait 1.5 seconds so they can see the "Success!" message before redirecting
      setTimeout(() => {
        if (!projectId) navigate('/dashboard');
        else setStatus('idle'); // Reset if they are just editing
      }, 1500);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.response?.data?.error || error.message;
      }
      alert('Error: ' + errorMessage);
      setStatus('idle'); // Reset on error
    }
  };

  // Dynamic button styling based on status
  const getButtonProps = () => {
    switch (status) {
      case 'generating':
        return {
          text: '🧠 AI is writing code...',
          color: '#f59e0b',
          disabled: true,
        };
      case 'downloading':
        return {
          text: '📦 Zipping & Downloading...',
          color: '#3b82f6',
          disabled: true,
        };
      case 'success':
        return { text: '✅ Success!', color: '#10b981', disabled: true };
      default:
        return {
          text: 'Generate & Download',
          color: '#6366f1',
          disabled: !prompt,
        };
    }
  };

  const btnInfo = getButtonProps();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {projectId ? 'Edit Extension' : 'Create New Extension'}
        </h1>

        <label style={styles.label}>Extension Name</label>
        <input
          type="text"
          placeholder="e.g., Color Picker Pro"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={styles.input}
          disabled={status !== 'idle'}
        />

        <label style={styles.label}>What should it do?</label>
        <textarea
          placeholder="Describe your Chrome extension in plain English. E.g., 'Make a popup that changes the background color of the current page...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          style={styles.textarea}
          disabled={status !== 'idle'}
        />

        <button
          onClick={handleGenerate}
          disabled={btnInfo.disabled}
          style={{ ...styles.button, backgroundColor: btnInfo.color }}
        >
          {btnInfo.text}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginTop: 0,
    color: '#1e293b',
    fontSize: '24px',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#475569',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '24px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
