import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [targetUrl, setTargetUrl] = useState('');
  const [accountCount, setAccountCount] = useState(5);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [targetUsername, setTargetUsername] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [proxy, setProxy] = useState('');
  const logsEndRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const handleGenerateAccounts = async () => {
    addLog(`Using proxy: ${proxy || 'None'}`);
    if (!targetUrl) {
      addLog('❌ Target URL is required', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`🚀 Starting account generation... (${accountCount} accounts)`, 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-accounts`, {
        count: parseInt(accountCount),
        targetUrl: targetUrl,
        proxy: proxy,
      });

      if (response.data.status === 'success') {
        setGeneratedAccounts(response.data.accounts);
        addLog(`✅ Successfully created ${response.data.totalSuccessful}/${response.data.totalAttempted} accounts`, 'success');
        
        response.data.results.forEach((result, index) => {
          if (result.success) {
            addLog(`✅ Account ${index + 1}: ${result.username} created`, 'success');
          } else {
            addLog(`❌ Account ${index + 1}: ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowerBoost = async () => {
    addLog(`Using proxy: ${proxy || 'None'}`);
    if (!targetUsername || !targetUrl || generatedAccounts.length === 0) {
      addLog('❌ Missing parameters: Target username, URL, or generated accounts', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`🚀 Starting follower boost attack on @${targetUsername}...`, 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/follower-boost`, {
        targetUsername: targetUsername,
        targetUrl: targetUrl,
        accountsToUse: generatedAccounts,
        proxy: proxy,
      });

      if (response.data.status === 'success') {
        addLog(`✅ Follower boost complete: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach((result, index) => {
          if (result.success) {
            addLog(`✅ ${result.account}: ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account}: ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSpam = async () => {
    addLog(`Using proxy: ${proxy || 'None'}`);
    if (!postUrl || !commentText || generatedAccounts.length === 0) {
      addLog('❌ Missing parameters: Post URL, comment text, or generated accounts', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`🚀 Starting comment spam attack on post...`, 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/comment-spam`, {
        postUrl: postUrl,
        commentText: commentText,
        accountsToUse: generatedAccounts,
        proxy: proxy,
      });

      if (response.data.status === 'success') {
        addLog(`✅ Comment spam complete: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach((result, index) => {
          if (result.success) {
            addLog(`✅ ${result.account}: ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account}: ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('📋 Logs cleared', 'info');
  };

  const downloadAccounts = () => {
    const dataStr = JSON.stringify(generatedAccounts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accounts_${Date.now()}.json`;
    link.click();
    addLog('📥 Accounts downloaded', 'info');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🤖 Scammer Simulator</h1>
          <p>Professional Penetration Testing Tool for Social Media Security</p>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          {/* Configuration Panel */}
          <div className="config-panel">
            <h2>⚙️ Configuration</h2>
            
            <div className="form-group">
              <label>Target App URL</label>
              <input
                type="text"
                placeholder="https://your-app.com/signup"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                disabled={isLoading}
              />
              <small>Enter the signup or login page URL of your app</small>
            </div>

            <div className="form-group">
              <label>Proxy Server (Optional)</label>
              <input
                type="text"
                placeholder="http://user:pass@host:port"
                value={proxy}
                onChange={(e) => setProxy(e.target.value)}
                disabled={isLoading}
              />
              <small>Route traffic through a proxy for stealth</small>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
                onClick={() => setActiveTab('generate')}
                disabled={isLoading}
              >
                📝 Generate Accounts
              </button>
              <button
                className={`tab ${activeTab === 'follower' ? 'active' : ''}`}
                onClick={() => setActiveTab('follower')}
                disabled={isLoading}
              >
                👥 Follower Boost
              </button>
              <button
                className={`tab ${activeTab === 'comment' ? 'active' : ''}`}
                onClick={() => setActiveTab('comment')}
                disabled={isLoading}
              >
                💬 Comment Spam
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'generate' && (
                <div className="tab-pane">
                  <h3>Generate Fake Accounts</h3>
                  <div className="form-group">
                    <label>Number of Accounts</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={accountCount}
                      onChange={(e) => setAccountCount(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateAccounts}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Generating...' : '🚀 Generate Accounts'}
                  </button>
                </div>
              )}

              {activeTab === 'follower' && (
                <div className="tab-pane">
                  <h3>Follower Boost Attack</h3>
                  <div className="form-group">
                    <label>Target Username</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={targetUsername}
                      onChange={(e) => setTargetUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleFollowerBoost}
                    disabled={isLoading || generatedAccounts.length === 0}
                  >
                    {isLoading ? '⏳ Attacking...' : `🚀 Boost Followers (${generatedAccounts.length} accounts)`}
                  </button>
                </div>
              )}

              {activeTab === 'comment' && (
                <div className="tab-pane">
                  <h3>Comment Spam Attack</h3>
                  <div className="form-group">
                    <label>Post URL</label>
                    <input
                      type="text"
                      placeholder="https://your-app.com/post/123"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Comment Text</label>
                    <textarea
                      placeholder="Enter the comment to spam..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={isLoading}
                      rows="3"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleCommentSpam}
                    disabled={isLoading || generatedAccounts.length === 0}
                  >
                    {isLoading ? '⏳ Attacking...' : `🚀 Spam Comments (${generatedAccounts.length} accounts)`}
                  </button>
                </div>
              )}
            </div>

            {/* Accounts Panel */}
            {generatedAccounts.length > 0 && (
              <div className="accounts-panel">
                <h3>📊 Generated Accounts ({generatedAccounts.length})</h3>
                <div className="accounts-list">
                  {generatedAccounts.slice(0, 5).map((account, index) => (
                    <div key={index} className="account-item">
                      <strong>{account.username}</strong>
                      <small>{account.email}</small>
                    </div>
                  ))}
                  {generatedAccounts.length > 5 && (
                    <div className="account-item">
                      <small>... and {generatedAccounts.length - 5} more</small>
                    </div>
                  )}
                </div>
                <button className="btn btn-secondary" onClick={downloadAccounts}>
                  📥 Download Accounts
                </button>
              </div>
            )}
          </div>

          {/* Logs Panel */}
          <div className="logs-panel">
            <div className="logs-header">
              <h2>📋 Live Logs</h2>
              <button className="btn btn-sm btn-secondary" onClick={clearLogs}>
                Clear
              </button>
            </div>
            <div className="logs-container">
              {logs.length === 0 ? (
                <div className="log-entry log-empty">
                  <span>Logs will appear here...</span>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`log-entry log-${log.type}`}>
                    <span className="timestamp">[{log.timestamp}]</span>
                    <span className="message">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>⚠️ This tool is for authorized security testing only. Unauthorized access to computer systems is illegal.</p>
      </footer>
    </div>
  );
}

export default App;
