import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';

  const links = [
    { to: '/', label: 'Home', exact: true },
    { to: '/predict', label: 'Predictor' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <div className="nav-avatar" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>AO</div>
          <span className="nav-brand-text">Academic Oracle</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {links.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {user ? (
            <>
              <div className="nav-user">
                <div className="nav-avatar">{initials}</div>
                <span>{user.name}</span>
              </div>
              <button className="nav-logout" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-logout" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-logout" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;