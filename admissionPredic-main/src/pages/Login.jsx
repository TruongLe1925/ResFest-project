import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div>
          <div className="login-box">
            <div className="login-logo">
              <div className="login-logo-icon">✦</div>
              <div className="login-logo-name">Academic Oracle</div>
              <div className="login-logo-tagline">The Clarified Path</div>
            </div>

            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <div className="input-wrap">
                  <span className="input-icon">@</span>
                  <input className="form-input" type="email" placeholder="Enter your credentials"
                    value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password
                  <a href="#">Forgot?</a>
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="input-toggle" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={isLoading}>
                {isLoading ? <><span className="spinner" /> Signing in...</> : <>Sign In →</>}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>

          <div className="login-stats">
            {[{ val: '98%', label: 'Accuracy' }, { val: '500+', label: 'Colleges' }, { val: '24/7', label: 'Support' }].map(s => (
              <div className="login-stat" key={s.label}>
                <div className="login-stat-val">{s.val}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <div>
          <div className="login-footer-brand">Academic Oracle</div>
          <div className="login-footer-copy">© 2024 The Academic Oracle. Your Clarified Path to Excellence.</div>
        </div>
        <nav className="login-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">University Partnerships</a>
          <a href="#">Contact Support</a>
        </nav>
      </footer>
    </div>
  );
};

export default Login;