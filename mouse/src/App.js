import { useState } from 'react';
import './App.css';

function App() {
  const [systemContent, setSystemContent] = useState('');
  const [userContent, setUserContent] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [showRawFormat, setShowRawFormat] = useState(false);

  const handleAddEntry = () => {
    const data = {
      messages: [
        { role: "System", content: systemContent },
        { role: "User", content: userContent },
        { role: "Chatbot", content: modelContent }
      ]
    };

    setEntries([...entries, data]);
    
    // Clear the form
    setSystemContent('');
    setUserContent('');
    setModelContent('');
  };

  const handleDownload = () => {
    try {
      const jsonlContent = entries.map(entry => JSON.stringify(entry)).join('\n');
      const blob = new Blob([jsonlContent], { type: 'application/json' });
      
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = 'dataset.jsonl';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const getRawJsonl = () => {
    return entries.map(entry => JSON.stringify(entry)).join('\n');
  };

  const handleCopy = () => {
    const content = showRawFormat ? getRawJsonl() : entries.map(entry => JSON.stringify(entry, null, 2)).join('\n');
    navigator.clipboard.writeText(content).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all entries?')) {
      setEntries([]);
    }
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>Mouse 🐁</h1>
      </div>
      <div className="input-container">
        <div className="input-group">
          <label htmlFor="system">SYSTEM</label>
          <textarea
            id="system"
            value={systemContent}
            onChange={(e) => setSystemContent(e.target.value)}
            rows="4"
          />
        </div>

        <div className="input-group">
          <label htmlFor="user">USER</label>
          <textarea
            id="user"
            value={userContent}
            onChange={(e) => setUserContent(e.target.value)}
            rows="4"
          />
        </div>

        <div className="input-group">
          <label htmlFor="model">MODEL</label>
          <textarea
            id="model"
            value={modelContent}
            onChange={(e) => setModelContent(e.target.value)}
            rows="4"
          />
        </div>

        <button onClick={handleAddEntry}>Add Entry</button>

        <div className="preview-section">
          <div className="preview-header">
            <h3>Preview ({entries.length} entries)</h3>
            <div className="format-controls">
              <div className="format-toggle">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showRawFormat}
                    onChange={(e) => setShowRawFormat(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-label">
                  JSONL Format
                </span>
              </div>
              <button className="copy-button" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
          <div className={`preview-content ${showRawFormat ? 'nowrap' : ''}`}>
            {entries.length > 0 ? (
              showRawFormat ? (
                <div className="preview-entry">
                  <pre className="jsonl-format">{getRawJsonl()}</pre>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <div key={index} className="preview-entry">
                    <pre>{JSON.stringify(entry, null, 2)}</pre>
                  </div>
                ))
              )
            ) : (
              <div className="preview-entry empty">
                <p>No entries yet. Add some data above!</p>
              </div>
            )}
          </div>
          <div className="preview-actions">
            <button 
              className="danger-button" 
              onClick={handleClear}
              disabled={entries.length === 0}
            >
              Clear All
            </button>
            <button 
              onClick={handleDownload}
              disabled={entries.length === 0}
            >
              Download Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
