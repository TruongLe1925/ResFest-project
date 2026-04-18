import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

import Card from '../components/Card';
import Loader from '../components/Loader';
import '../pages/Profile.css';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <Card>
          <h2>{user.name}</h2>
          <p className="user-meta"><strong>Username:</strong> {user.username || user.name}</p>
          <p className="user-email">{user.email}</p>
          <p className="user-meta">
            <strong>Member since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">0</span>
              <span>Predictions</span>
            </div>
            <div className="stat">
              <span className="stat-number">3</span>
              <span>Favorites</span>
            </div>
          </div>
        </Card>
        <Card className="recent-section">
          <h3>Recent Predictions</h3>
          <p>No predictions yet. <Link to="/predict">Make one now!</Link></p>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

