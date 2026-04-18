import React from 'react';
import Navbar from './Navbar';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div>
        <div className="footer-brand">Academic Oracle</div>
        <div className="footer-copy">© 2024 The Academic Oracle. Your Clarified Path to Excellence.</div>
      </div>
      <nav className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">University Partnerships</a>
        <a href="#">Contact Support</a>
      </nav>
    </div>
  </footer>
);

const Layout = ({ children }) => (
  <div className="layout">
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

export default Layout;