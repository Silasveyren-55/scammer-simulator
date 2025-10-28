import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [accountCount, setAccountCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [proxy, setProxy] = useState('');
  const [viewDuration, setViewDuration] = useState(5000);
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
    addLog(`🔍 Platform: ${selectedPlatform.toUpperCase()}`);
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
      }, {
        headers: { 'X-API-Key': 'scammer-simulator-secure-key-2025' }
      });

      if (response.data.status === 'success') {
        setGeneratedAccounts(response.data.accounts);
        addLog(`✅ Account generation complete: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach(result => {
          if (result.success) {
            addLog(`✅ ${result.username} - ${result.message}`, 'success');
          } else {
            addLog(`❌ ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowerBoost = async () => {
    addLog(`🔍 Platform: ${selectedPlatform.toUpperCase()}`);
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
      }, {
        headers: { 'X-API-Key': 'scammer-simulator-secure-key-2025' }
      });

      if (response.data.status === 'success') {
        addLog(`✅ Follower boost complete: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach(result => {
          if (result.success) {
            addLog(`✅ ${result.account} - ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account} - ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikesBoost = async () => {
    addLog(`🔍 Platform: ${selectedPlatform.toUpperCase()}`);
    addLog(`Using proxy: ${proxy || 'None'}`);
    if (!postUrl || generatedAccounts.length === 0) {
      addLog('❌ Missing parameters: Post URL or generated accounts', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`🚀 Starting likes boost attack on post...`, 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/likes-boost`, {
        postUrl: postUrl,
        accountsToUse: generatedAccounts,
        proxy: proxy,
      }, {
        headers: { 'X-API-Key': 'scammer-simulator-secure-key-2025' }
      });

      if (response.data.status === 'success') {
        addLog(`✅ Likes boost complete on ${response.data.platform}: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach(result => {
          if (result.success) {
            addLog(`✅ ${result.account} - ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account} - ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewsBoost = async () => {
    addLog(`🔍 Platform: ${selectedPlatform.toUpperCase()}`);
    addLog(`Using proxy: ${proxy || 'None'}`);
    if (!contentUrl || generatedAccounts.length === 0) {
      addLog('❌ Missing parameters: Content URL or generated accounts', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`🚀 Starting views boost attack on content...`, 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/views-boost`, {
        contentUrl: contentUrl,
        accountsToUse: generatedAccounts,
        proxy: proxy,
        viewDuration: viewDuration,
      }, {
        headers: { 'X-API-Key': 'scammer-simulator-secure-key-2025' }
      });

      if (response.data.status === 'success') {
        addLog(`✅ Views boost complete on ${response.data.platform}: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach(result => {
          if (result.success) {
            addLog(`✅ ${result.account} - ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account} - ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSpam = async () => {
    addLog(`🔍 Platform: ${selectedPlatform.toUpperCase()}`);
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
      }, {
        headers: { 'X-API-Key': 'scammer-simulator-secure-key-2025' }
      });

      if (response.data.status === 'success') {
        addLog(`✅ Comment spam complete on ${response.data.platform}: ${response.data.totalSuccessful}/${response.data.totalAttempted} successful`, 'success');
        response.data.results.forEach(result => {
          if (result.success) {
            addLog(`✅ ${result.account} - ${result.action}`, 'success');
          } else {
            addLog(`❌ ${result.account} - ${result.message}`, 'error');
          }
        });
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAccounts = () => {
    const dataStr = JSON.stringify(generatedAccounts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accounts_${new Date().getTime()}.json`;
    link.click();
    addLog('✅ Accounts downloaded successfully', 'success');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Scammer Simulator - Professional Security Testing Tool</h1>
        <p>Test your social media app's security against bot attacks and fake engagement</p>
      </header>

      <div className="container">
        {/* Configuration Panel */}
        <div className="config-panel">
          <h2>⚙️ Configuration</h2>

          {/* Platform Selector */}
          <div className="form-group">
            <label>📱 Select Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              disabled={isLoading}
              className="platform-select"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter/X</option>
              <option value="facebook">Facebook</option>
              <option value="telegram">Telegram</option>
            </select>
            <small>Choose the social media platform you want to test</small>
          </div>

          {/* Target URL */}
          <div className="form-group">
            <label>🔗 Target App URL</label>
            <input
              type="text"
              placeholder="https://your-app.com/signup"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              disabled={isLoading}
            />
            <small>Enter the signup or login page URL of your app</small>
          </div>

          {/* Proxy Server */}
          <div className="form-group">
            <label>🌐 Proxy Server (Optional)</label>
            <input
              type="text"
              placeholder="http://user:pass@host:port"
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              disabled={isLoading}
            />
            <small>Route traffic through a proxy for stealth and distributed testing</small>
          </div>

          {/* Account Count */}
          <div className="form-group">
            <label>👥 Number of Accounts to Generate</label>
            <input
              type="number"
              min="1"
              max="100"
              value={accountCount}
              onChange={(e) => setAccountCount(e.target.value)}
              disabled={isLoading}
            />
            <small>Generate between 1 and 100 test accounts</small>
          </div>

          {/* View Duration */}
          <div className="form-group">
            <label>⏱️ View Duration (milliseconds)</label>
            <input
              type="number"
              min="1000"
              max="60000"
              value={viewDuration}
              onChange={(e) => setViewDuration(e.target.value)}
              disabled={isLoading}
            />
            <small>How long each bot should view content (1000-60000ms)</small>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
              disabled={isLoading}
            >
              👤 Generate Accounts
            </button>
            <button
              className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
              onClick={() => setActiveTab('followers')}
              disabled={isLoading}
            >
              👥 Followers
            </button>
            <button
              className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
              disabled={isLoading}
            >
              ❤️ Likes
            </button>
            <button
              className={`tab-btn ${activeTab === 'views' ? 'active' : ''}`}
              onClick={() => setActiveTab('views')}
              disabled={isLoading}
            >
              👁️ Views
            </button>
            <button
              className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
              disabled={isLoading}
            >
              💬 Comments
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'generate' && (
              <div className="tab-pane">
                <h3>Generate Fake Accounts</h3>
                <button
                  className="action-btn"
                  onClick={handleGenerateAccounts}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : '🚀 Generate Accounts'}
                </button>
              </div>
            )}

            {activeTab === 'followers' && (
              <div className="tab-pane">
                <h3>Follower Boost Attack</h3>
                <div className="form-group">
                  <label>Target Username</label>
                  <input
                    type="text"
                    placeholder="username (without @)"
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button
                  className="action-btn"
                  onClick={handleFollowerBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                >
                  {isLoading ? 'Boosting...' : `🚀 Boost Followers (${generatedAccounts.length} accounts)`}
                </button>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="tab-pane">
                <h3>Likes Boost Attack</h3>
                <div className="form-group">
                  <label>Post URL (Link-Based)</label>
                  <input
                    type="text"
                    placeholder="https://platform.com/post/123"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <small>Just provide the link to the post - platform is auto-detected</small>
                </div>
                <button
                  className="action-btn"
                  onClick={handleLikesBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                >
                  {isLoading ? 'Boosting...' : `❤️ Boost Likes (${generatedAccounts.length} accounts)`}
                </button>
              </div>
            )}

            {activeTab === 'views' && (
              <div className="tab-pane">
                <h3>Views Boost Attack</h3>
                <div className="form-group">
                  <label>Content URL (Link-Based)</label>
                  <input
                    type="text"
                    placeholder="https://platform.com/video/123"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <small>Just provide the link to the content - platform is auto-detected</small>
                </div>
                <button
                  className="action-btn"
                  onClick={handleViewsBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                >
                  {isLoading ? 'Boosting...' : `👁️ Boost Views (${generatedAccounts.length} accounts)`}
                </button>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="tab-pane">
                <h3>Comment Spam Attack</h3>
                <div className="form-group">
                  <label>Post URL (Link-Based)</label>
                  <input
                    type="text"
                    placeholder="https://platform.com/post/123"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <small>Just provide the link to the post - platform is auto-detected</small>
                </div>
                <div className="form-group">
                  <label>Comment Text</label>
                  <textarea
                    placeholder="Enter the comment text to spam..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isLoading}
                    rows="3"
                  />
                </div>
                <button
                  className="action-btn"
                  onClick={handleCommentSpam}
                  disabled={isLoading || generatedAccounts.length === 0}
                >
                  {isLoading ? 'Spamming...' : `💬 Spam Comments (${generatedAccounts.length} accounts)`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logs and Accounts Section */}
        <div className="results-panel">
          {/* Logs */}
          <div className="logs-section">
            <h2>📊 Real-Time Logs</h2>
            <div className="logs-container">
              {logs.map((log, idx) => (
                <div key={idx} className={`log-entry log-${log.type}`}>
                  <span className="timestamp">{log.timestamp}</span>
                  <span className="message">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Generated Accounts */}
          {generatedAccounts.length > 0 && (
            <div className="accounts-section">
              <h2>👥 Generated Accounts ({generatedAccounts.length})</h2>
              <button className="download-btn" onClick={downloadAccounts}>
                📥 Download Accounts
              </button>
              <div className="accounts-list">
                {generatedAccounts.slice(0, 5).map((account, idx) => (
                  <div key={idx} className="account-card">
                    <strong>{account.username}</strong>
                    <small>{account.email}</small>
                  </div>
                ))}
                {generatedAccounts.length > 5 && (
                  <div className="account-card">
                    <small>+{generatedAccounts.length - 5} more accounts...</small>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>🔐 Secure | 🎯 Accurate | 🚀 Professional | ⚡ Fast</p>
        <p>For authorized security testing only. Always test on staging environments.</p>
      </footer>
    </div>
  );
}
