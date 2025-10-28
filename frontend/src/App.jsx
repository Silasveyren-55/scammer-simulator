import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_KEY = 'scammer-simulator-secure-key-2025';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [platform, setPlatform] = useState('tiktok');
  const [targetUrl, setTargetUrl] = useState('');
  const [proxyServer, setProxyServer] = useState('');
  const [accountCount, setAccountCount] = useState(5);
  const [postUrl, setPostUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [viewDuration, setViewDuration] = useState(5);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const handleGenerateAccounts = async () => {
    if (!targetUrl.trim()) {
      addLog('❌ Please enter your app URL', 'error');
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting test account generation on ${platform}...`, 'info');
    addLog(`📍 Target: ${targetUrl}`, 'info');
    if (proxyServer) addLog(`🔗 Using proxy: ${proxyServer}`, 'info');
    addLog(`📊 Creating ${accountCount} test accounts...`, 'info');

    try {
      const response = await axios.post(
        `${API_URL}/api/generate-accounts`,
        {
          count: accountCount,
          targetUrl,
          proxy: proxyServer || undefined,
        },
        {
          headers: { 'X-API-Key': API_KEY },
        }
      );

      if (response.data.results) {
        const successCount = response.data.results.filter(r => r.success).length;
        addLog(`✅ Successfully created ${successCount}/${accountCount} test accounts`, 'success');
        
        const accounts = response.data.results
          .filter(r => r.success)
          .map(r => ({
            username: r.username,
            email: r.email,
            password: r.password,
          }));
        
        setGeneratedAccounts(accounts);
        addLog('💾 Accounts saved and ready for testing', 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowerBoost = async () => {
    if (!postUrl.trim()) {
      addLog('❌ Please enter a username to follow', 'error');
      return;
    }

    if (generatedAccounts.length === 0) {
      addLog('❌ Please generate test accounts first', 'error');
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting follower boost test...`, 'info');
    addLog(`👤 Target username: ${postUrl}`, 'info');
    addLog(`📊 Using ${generatedAccounts.length} test accounts...`, 'info');

    try {
      const response = await axios.post(
        `${API_URL}/api/follower-boost`,
        {
          targetUsername: postUrl,
          targetUrl,
          accountsToUse: generatedAccounts,
          proxy: proxyServer || undefined,
        },
        {
          headers: { 'X-API-Key': API_KEY },
        }
      );

      if (response.data.results) {
        const successCount = response.data.results.filter(r => r.success).length;
        addLog(`✅ Successfully followed with ${successCount}/${generatedAccounts.length} accounts`, 'success');
        addLog('📈 Test complete. Check your app\'s security logs for detection details.', 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikesBoost = async () => {
    if (!postUrl.trim()) {
      addLog('❌ Please enter the post/content link', 'error');
      return;
    }

    if (generatedAccounts.length === 0) {
      addLog('❌ Please generate test accounts first', 'error');
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting likes boost test...`, 'info');
    addLog(`🔗 Target: ${postUrl}`, 'info');
    addLog(`📊 Using ${generatedAccounts.length} test accounts...`, 'info');

    try {
      const response = await axios.post(
        `${API_URL}/api/likes-boost`,
        {
          postUrl,
          accountsToUse: generatedAccounts,
          proxy: proxyServer || undefined,
        },
        {
          headers: { 'X-API-Key': API_KEY },
        }
      );

      if (response.data.results) {
        const successCount = response.data.results.filter(r => r.success).length;
        addLog(`✅ Successfully liked with ${successCount}/${generatedAccounts.length} accounts`, 'success');
        addLog('📈 Test complete. Review your security metrics.', 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewsBoost = async () => {
    if (!postUrl.trim()) {
      addLog('❌ Please enter the video/content link', 'error');
      return;
    }

    if (generatedAccounts.length === 0) {
      addLog('❌ Please generate test accounts first', 'error');
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting views boost test...`, 'info');
    addLog(`🔗 Target: ${postUrl}`, 'info');
    addLog(`⏱️ View duration: ${viewDuration} seconds per account`, 'info');
    addLog(`📊 Using ${generatedAccounts.length} test accounts...`, 'info');

    try {
      const response = await axios.post(
        `${API_URL}/api/views-boost`,
        {
          contentUrl: postUrl,
          accountsToUse: generatedAccounts,
          viewDuration: viewDuration * 1000,
          proxy: proxyServer || undefined,
        },
        {
          headers: { 'X-API-Key': API_KEY },
        }
      );

      if (response.data.results) {
        const successCount = response.data.results.filter(r => r.success).length;
        addLog(`✅ Successfully viewed with ${successCount}/${generatedAccounts.length} accounts`, 'success');
        addLog('📈 Test complete. Check your analytics.', 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSpam = async () => {
    if (!postUrl.trim()) {
      addLog('❌ Please enter the post link', 'error');
      return;
    }

    if (!commentText.trim()) {
      addLog('❌ Please enter comment text', 'error');
      return;
    }

    if (generatedAccounts.length === 0) {
      addLog('❌ Please generate test accounts first', 'error');
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting comment test...`, 'info');
    addLog(`🔗 Target: ${postUrl}`, 'info');
    addLog(`💬 Comment: "${commentText}"`, 'info');
    addLog(`📊 Using ${generatedAccounts.length} test accounts...`, 'info');

    try {
      const response = await axios.post(
        `${API_URL}/api/comment-spam`,
        {
          postUrl,
          commentText,
          accountsToUse: generatedAccounts,
          proxy: proxyServer || undefined,
        },
        {
          headers: { 'X-API-Key': API_KEY },
        }
      );

      if (response.data.results) {
        const successCount = response.data.results.filter(r => r.success).length;
        addLog(`✅ Successfully posted ${successCount}/${generatedAccounts.length} comments`, 'success');
        addLog('📈 Test complete. Review your content moderation.', 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAccounts = () => {
    const csv = [
      ['Username', 'Email', 'Password'],
      ...generatedAccounts.map(a => [a.username, a.email, a.password]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-accounts.csv';
    a.click();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">🛡️ Sentinel Test Suite</h1>
            <p className="app-subtitle">Professional Security Testing for Social Media Platforms</p>
          </div>
          <div className="header-badge">
            <span className="badge-text">Enterprise Grade</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'welcome' ? 'active' : ''}`}
              onClick={() => setActiveTab('welcome')}
            >
              📖 Getting Started
            </button>
            <button
              className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts')}
            >
              👤 Create Test Accounts
            </button>
            <button
              className={`nav-item ${activeTab === 'followers' ? 'active' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              👥 Test Followers
            </button>
            <button
              className={`nav-item ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              ❤️ Test Likes
            </button>
            <button
              className={`nav-item ${activeTab === 'views' ? 'active' : ''}`}
              onClick={() => setActiveTab('views')}
            >
              👁️ Test Views
            </button>
            <button
              className={`nav-item ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              💬 Test Comments
            </button>
            <button
              className={`nav-item ${activeTab === 'accounts-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts-list')}
            >
              📋 Manage Accounts
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {/* Welcome Tab */}
          {activeTab === 'welcome' && (
            <div className="tab-content welcome-tab">
              <div className="welcome-card">
                <h2>Welcome to Sentinel Test Suite</h2>
                <p>A professional security testing platform designed to validate your social media application's defenses against automated attacks and fraudulent activities.</p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔐</div>
                  <h3>Enterprise Security</h3>
                  <p>Advanced anti-detection mechanisms including browser fingerprinting evasion and behavioral mimicry.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌍</div>
                  <h3>Multi-Platform</h3>
                  <p>Test your security against TikTok, Instagram, Twitter, Facebook, and Telegram clones.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Fast & Efficient</h3>
                  <p>Rapid testing with real-time monitoring and detailed logging of all activities.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Detailed Reports</h3>
                  <p>Comprehensive logs and success rates to identify security vulnerabilities.</p>
                </div>
              </div>

              <div className="quick-start-section">
                <h3>Quick Start Guide</h3>
                <ol className="quick-start-steps">
                  <li><strong>Select a Platform:</strong> Choose which social media platform you want to test (TikTok, Instagram, etc.)</li>
                  <li><strong>Enter Your App URL:</strong> Provide the URL of your application's signup or login page</li>
                  <li><strong>Create Test Accounts:</strong> Generate realistic test accounts to use for testing</li>
                  <li><strong>Run Security Tests:</strong> Test followers, likes, views, and comments to see what gets through</li>
                  <li><strong>Review Results:</strong> Check the logs to understand your security gaps</li>
                  <li><strong>Strengthen Security:</strong> Use the results to improve your app's defenses</li>
                </ol>
              </div>
            </div>
          )}

          {/* Configuration Panel (shown in all test tabs) */}
          {activeTab !== 'welcome' && activeTab !== 'accounts-list' && (
            <div className="config-panel">
              <div className="config-group">
                <label htmlFor="platform">Which platform are you testing?</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="form-select"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="facebook">Facebook</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>

              <div className="config-group">
                <label htmlFor="targetUrl">Your app's URL (for account creation)</label>
                <input
                  id="targetUrl"
                  type="text"
                  placeholder="e.g., https://your-app.com/signup"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="form-input"
                />
                <small>Enter your application's signup or login page URL</small>
              </div>

              <div className="config-group">
                <label htmlFor="proxyServer">Proxy Server (optional)</label>
                <input
                  id="proxyServer"
                  type="text"
                  placeholder="e.g., http://user:pass@proxy.com:8080"
                  value={proxyServer}
                  onChange={(e) => setProxyServer(e.target.value)}
                  className="form-input"
                />
                <small>Leave empty to test from a single IP. Use a proxy for distributed testing.</small>
              </div>
            </div>
          )}

          {/* Create Test Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Create Test Accounts</h2>
                <p>Generate realistic test accounts to use for security testing</p>
              </div>

              <div className="test-form">
                <div className="form-group">
                  <label htmlFor="accountCount">How many test accounts do you need?</label>
                  <div className="input-with-slider">
                    <input
                      id="accountCount"
                      type="number"
                      min="1"
                      max="100"
                      value={accountCount}
                      onChange={(e) => setAccountCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="form-input"
                    />
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={accountCount}
                      onChange={(e) => setAccountCount(parseInt(e.target.value))}
                      className="form-slider"
                    />
                  </div>
                  <small>Recommended: 5-10 accounts for initial testing</small>
                </div>

                <button
                  onClick={handleGenerateAccounts}
                  disabled={isLoading}
                  className="btn btn-primary btn-large"
                >
                  {isLoading ? '⏳ Creating Accounts...' : '🚀 Create Test Accounts'}
                </button>
              </div>
            </div>
          )}

          {/* Test Followers Tab */}
          {activeTab === 'followers' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Test Follower Security</h2>
                <p>Verify your app can detect and prevent fake follower attacks</p>
              </div>

              <div className="test-form">
                <div className="form-group">
                  <label htmlFor="followerUsername">Target username to follow</label>
                  <input
                    id="followerUsername"
                    type="text"
                    placeholder="e.g., @testuser or testuser"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="form-input"
                  />
                  <small>Enter the username that the test accounts will follow</small>
                </div>

                <div className="info-box">
                  <p>📊 <strong>{generatedAccounts.length}</strong> test accounts ready to use</p>
                  {generatedAccounts.length === 0 && (
                    <p className="warning">⚠️ Please create test accounts first</p>
                  )}
                </div>

                <button
                  onClick={handleFollowerBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                  className="btn btn-primary btn-large"
                >
                  {isLoading ? '⏳ Testing...' : '👥 Start Follower Test'}
                </button>
              </div>
            </div>
          )}

          {/* Test Likes Tab */}
          {activeTab === 'likes' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Test Likes Security</h2>
                <p>Verify your app can detect and prevent fake likes</p>
              </div>

              <div className="test-form">
                <div className="form-group">
                  <label htmlFor="likesUrl">Link to the post you want to test</label>
                  <input
                    id="likesUrl"
                    type="text"
                    placeholder="e.g., https://your-app.com/post/12345"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="form-input"
                  />
                  <small>Paste the full URL of the post or content</small>
                </div>

                <div className="info-box">
                  <p>📊 <strong>{generatedAccounts.length}</strong> test accounts ready to use</p>
                  {generatedAccounts.length === 0 && (
                    <p className="warning">⚠️ Please create test accounts first</p>
                  )}
                </div>

                <button
                  onClick={handleLikesBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                  className="btn btn-primary btn-large"
                >
                  {isLoading ? '⏳ Testing...' : '❤️ Start Likes Test'}
                </button>
              </div>
            </div>
          )}

          {/* Test Views Tab */}
          {activeTab === 'views' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Test Views Security</h2>
                <p>Verify your app can detect and prevent fake views</p>
              </div>

              <div className="test-form">
                <div className="form-group">
                  <label htmlFor="viewsUrl">Link to the video you want to test</label>
                  <input
                    id="viewsUrl"
                    type="text"
                    placeholder="e.g., https://your-app.com/video/12345"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="form-input"
                  />
                  <small>Paste the full URL of the video or content</small>
                </div>

                <div className="form-group">
                  <label htmlFor="viewDuration">How long should each view last? (seconds)</label>
                  <div className="input-with-slider">
                    <input
                      id="viewDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={viewDuration}
                      onChange={(e) => setViewDuration(Math.max(1, parseInt(e.target.value) || 1))}
                      className="form-input"
                    />
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={viewDuration}
                      onChange={(e) => setViewDuration(parseInt(e.target.value))}
                      className="form-slider"
                    />
                  </div>
                  <small>Recommended: 5-10 seconds for realistic viewing</small>
                </div>

                <div className="info-box">
                  <p>📊 <strong>{generatedAccounts.length}</strong> test accounts ready to use</p>
                  {generatedAccounts.length === 0 && (
                    <p className="warning">⚠️ Please create test accounts first</p>
                  )}
                </div>

                <button
                  onClick={handleViewsBoost}
                  disabled={isLoading || generatedAccounts.length === 0}
                  className="btn btn-primary btn-large"
                >
                  {isLoading ? '⏳ Testing...' : '👁️ Start Views Test'}
                </button>
              </div>
            </div>
          )}

          {/* Test Comments Tab */}
          {activeTab === 'comments' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Test Comments Security</h2>
                <p>Verify your app can detect and prevent spam comments</p>
              </div>

              <div className="test-form">
                <div className="form-group">
                  <label htmlFor="commentsUrl">Link to the post you want to test</label>
                  <input
                    id="commentsUrl"
                    type="text"
                    placeholder="e.g., https://your-app.com/post/12345"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="form-input"
                  />
                  <small>Paste the full URL of the post or content</small>
                </div>

                <div className="form-group">
                  <label htmlFor="commentContent">What comment should be posted?</label>
                  <textarea
                    id="commentContent"
                    placeholder="e.g., Great content! Check out my profile..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="form-textarea"
                    rows="4"
                  />
                  <small>Enter the comment text that will be posted</small>
                </div>

                <div className="info-box">
                  <p>📊 <strong>{generatedAccounts.length}</strong> test accounts ready to use</p>
                  {generatedAccounts.length === 0 && (
                    <p className="warning">⚠️ Please create test accounts first</p>
                  )}
                </div>

                <button
                  onClick={handleCommentSpam}
                  disabled={isLoading || generatedAccounts.length === 0}
                  className="btn btn-primary btn-large"
                >
                  {isLoading ? '⏳ Testing...' : '💬 Start Comments Test'}
                </button>
              </div>
            </div>
          )}

          {/* Manage Accounts Tab */}
          {activeTab === 'accounts-list' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Manage Test Accounts</h2>
                <p>View and download your generated test accounts</p>
              </div>

              {generatedAccounts.length === 0 ? (
                <div className="empty-state">
                  <p>No test accounts created yet</p>
                  <button
                    onClick={() => setActiveTab('accounts')}
                    className="btn btn-secondary"
                  >
                    Create Test Accounts
                  </button>
                </div>
              ) : (
                <div className="accounts-section">
                  <div className="accounts-header">
                    <h3>{generatedAccounts.length} Test Accounts</h3>
                    <button
                      onClick={downloadAccounts}
                      className="btn btn-secondary"
                    >
                      📥 Download as CSV
                    </button>
                  </div>

                  <div className="accounts-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Password</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedAccounts.map((account, idx) => (
                          <tr key={idx}>
                            <td>{account.username}</td>
                            <td>{account.email}</td>
                            <td className="password-cell">
                              <code>{account.password}</code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs Panel */}
          <div className="logs-panel">
            <div className="logs-header">
              <h3>📊 Test Activity Log</h3>
              <button
                onClick={() => setLogs([])}
                className="btn btn-small"
              >
                Clear Logs
              </button>
            </div>
            <div className="logs-container">
              {logs.length === 0 ? (
                <p className="logs-empty">Logs will appear here when you run tests</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`log-entry log-${log.type}`}>
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>🛡️ Sentinel Test Suite v2.0 | Enterprise Security Testing Platform</p>
        <p>For authorized security testing only. Always test on staging environments.</p>
      </footer>
    </div>
  );
}
