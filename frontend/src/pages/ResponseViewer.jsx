export default function ResponseViewer({ text, loading }) {
  return (
    <div style={styles.box}>
      {loading ? <h3>⚡ Generating...</h3> : <h3>Response</h3>}

      <pre style={styles.text}>{text}</pre>
    </div>
  );
}

const styles = {
  box: {
    marginTop: '30px',
    background: '#020617',
    color: '#22c55e',
    padding: '20px',
    borderRadius: '10px',
    minHeight: '200px',
  },
  text: {
    whiteSpace: 'pre-wrap',
  },
};
