import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Details</h3>
          <p>Phone: <a href="tel:+442036332040">+44 (0)20 3633 2040</a></p>
          <p>Email: <a href="mailto:talk2us@skiwithease.com">talk2us@skiwithease.com</a></p>
        </div>

        <div className="footer-section">
          <h3>Office Hours</h3>
          <p>Open 7 days a week</p>
          <p>8 AM – 9 PM</p>
        </div>

        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Ski with Ease Ltd.</p>
        <p>Designed & Built by Gnattr Labs</p>
      </div>
    </footer>
  );
};

export default Footer;