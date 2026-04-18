import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

import Loader from '../components/Loader';
import '../pages/Home.css';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="home-dashboard">
      <section className="home-hero">
        <div className="hero-left">
          <div className="hero-badge">AI-Driven Admissions Intelligence</div>
          <h1>
            Your Path to <span>Academic Excellence</span>, Clarified.
          </h1>
          <p>
            Explore university targets, review cutoff scores, and estimate admission chances
            with a clear data-driven workflow.
          </p>
          <div className="hero-actions">
            <Link to="/predict" className="cta-primary">Start Prediction</Link>
            <Link to="/predict" className="cta-secondary">View Universities</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-preview-card">
            <p className="preview-uni">Đại học Bách Khoa TP.HCM</p>
            <p className="preview-probability">84% <span>Probability</span></p>
            <div className="preview-bar">
              <div className="preview-bar-fill" />
            </div>
            <p className="preview-note">Realtime guidance powered by your exam and transcript profile.</p>
          </div>
        </div>
      </section>

      <section className="home-why">
        <h2>Why The Academic Oracle?</h2>
        <p>Bureaucracy replaced by precision data.</p>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Holistic Matching</h3>
            <p>Compare your academic profile against realistic university requirements.</p>
          </article>
          <article className="feature-card feature-card-blue">
            <h3>94.8% Accuracy</h3>
            <p>Validated across historical applications and admission outcomes.</p>
          </article>
          <article className="feature-card">
            <h3>Essay & Profile Insight</h3>
            <p>Receive actionable feedback for stronger and more competitive applications.</p>
          </article>
          <article className="feature-card">
            <h3>Global Institution Database</h3>
            <p>Explore universities, cutoff scores, and admission trends in one place.</p>
          </article>
        </div>
      </section>

      <section className="home-cta-banner">
        <h2>Stop Guessing. Start Planning.</h2>
        <p>
          {user
            ? `Welcome back ${user.name}, continue your admission strategy now.`
            : 'Join students who use Academic Oracle to plan admissions with confidence.'}
        </p>
        <Link to="/predict" className="cta-primary">Launch Predictor Tool</Link>
      </section>

      <div className="home-quick-links">
        <Link to={user ? '/profile' : '/login'} className="quick-link">
          {user ? 'Open Profile' : 'Sign In'}
        </Link>
        <Link to="/register" className="quick-link">Create Account</Link>
      </div>
    </div>
  );
};

export default Home;

