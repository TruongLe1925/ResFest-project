import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!agreed) { setError('Please agree to Terms of Service'); return; }
    setIsLoading(true); setError('');
    try {
      const success = await register(form.email, form.password, form.username);
      if (success) navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <main className="register-main">
        <div className="register-left">
          <div className="register-left-logo">
            <div className="register-left-logo-icon">🎓</div>
            Academic Oracle
          </div>
          <div>
            <h1 className="register-left-headline">Your clarified path to excellence starts here.</h1>
            <p className="register-left-sub">Join thousands of students using data-driven insights to navigate their university admission journey with confidence and clarity.</p>
          </div>
          <div className="register-left-stat">
            <div className="register-left-stat-label">Global Success Rate</div>
            <div className="register-left-stat-val">94.2%</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 9999, marginBottom: '0.75rem', overflow: 'hidden' }}>
              <div style={{ width: '94%', height: '100%', background: 'white', borderRadius: 9999 }} />
            </div>
            <div className="register-left-quote">"The Oracle predicted my reach school admission with 90% accuracy."</div>
          </div>
        </div>

        <div className="register-right">
          <h2 className="register-right-title">Create Account</h2>
          <p className="register-right-sub">Join Academic Oracle to start predicting your future.</p>

          {error && (
            <div className="error-message">{error}<button onClick={() => setError('')}>×</button></div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className="form-input"
                  name="username"
                  placeholder="Choose a username"
                  aria-label="Username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input className="form-input" type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input className="form-input" type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                <button type="button" className="input-toggle" onClick={() => setShowPass(v => !v)} tabIndex={-1}>{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔐</span>
                <input
                  className="form-input"
                  type={showConfirmPass ? 'text' : 'password'}
                  name="confirm"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="input-toggle" onClick={() => setShowConfirmPass(v => !v)} tabIndex={-1}>
                  {showConfirmPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <label className="form-checkbox">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              I agree to the <a href="#" style={{ margin: '0 0.2rem' }}>Terms of Service</a> and <a href="#" style={{ marginLeft: '0.2rem' }}>Privacy Policy</a>.
            </label>

            <button className="auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
            </button>

            <div className="auth-divider">or register with</div>
            <div className="social-btns">
              <button type="button" className="social-btn">🌐 Google</button>
              <button type="button" className="social-btn">🍎 Apple</button>
            </div>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </main>

      <footer className="register-footer">
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>Academic Oracle</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '0.5rem' }}>© 2024 The Clarified Path to Excellence.</span>
        </div>
        <nav style={{ display: 'flex', gap: '1.25rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default Register;