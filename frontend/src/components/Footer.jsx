import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="qc-footer">
      <div className="qc-footer-glow"></div>
      <div className="container position-relative z-1">
        <div className="row g-4 lg-g-5 mb-5">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-12">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="qc-footer-logo-icon">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <span className="qc-footer-brand-name">
                Quick<span>Court</span>
              </span>
              <span className="badge qc-badge-live ms-2">LIVE</span>
            </div>
            <p className="qc-footer-desc mb-4">
              Ahmedabad’s premier sports facility & court booking platform. Discover top-rated venues, check real-time court availability, and lock in your slots seamlessly.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small fw-medium me-2">Follow Us:</span>
              <a href="#!" className="qc-social-btn" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#!" className="qc-social-btn" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#!" className="qc-social-btn" title="X (Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#!" className="qc-social-btn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-4 col-6">
            <h6 className="qc-footer-heading">Explore Venues</h6>
            <ul className="list-unstyled qc-footer-links">
              <li>
                <Link to="/venues">
                  <i className="bi bi-chevron-right"></i> All Venues
                </Link>
              </li>
              <li>
                <Link to="/venues?sport=Badminton">
                  <i className="bi bi-chevron-right"></i> Badminton Courts
                </Link>
              </li>
              <li>
                <Link to="/venues?sport=Football">
                  <i className="bi bi-chevron-right"></i> Football Turfs
                </Link>
              </li>
              <li>
                <Link to="/venues?sport=Cricket">
                  <i className="bi bi-chevron-right"></i> Cricket Arenas
                </Link>
              </li>
              <li>
                <Link to="/venues?sport=Tennis">
                  <i className="bi bi-chevron-right"></i> Tennis Courts
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners Column */}
          <div className="col-lg-3 col-md-4 col-6">
            <h6 className="qc-footer-heading">For Venue Owners</h6>
            <ul className="list-unstyled qc-footer-links">
              <li>
                <Link to="/signup?role=owner">
                  <i className="bi bi-chevron-right"></i> List Your Venue
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard">
                  <i className="bi bi-chevron-right"></i> Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner/facilities">
                  <i className="bi bi-chevron-right"></i> Manage Facilities
                </Link>
              </li>
              <li>
                <Link to="/owner/bookings">
                  <i className="bi bi-chevron-right"></i> Track Bookings
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard">
                  <i className="bi bi-chevron-right"></i> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-lg-3 col-md-4 col-12">
            <h6 className="qc-footer-heading">Need Support?</h6>
            <div className="qc-footer-contact-card p-3 mb-3">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="qc-contact-icon">
                  <i className="bi bi-headset"></i>
                </div>
                <div>
                  <div className="text-white fw-semibold small">Customer Support</div>
                  <a href="mailto:support@quickcourt.com" className="text-emerald text-decoration-none small">
                    support@quickcourt.com
                  </a>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="qc-contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div>
                  <div className="text-white fw-semibold small">Location</div>
                  <div className="text-secondary small">Ahmedabad, Gujarat</div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/sports+complex+court+turf+Ahmedabad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-success w-100 mt-2 rounded-pill small"
              >
                <i className="bi bi-map me-1"></i> View Venues Map
              </a>
            </div>
            <div className="qc-footer-badge-box">
              <i className="bi bi-shield-check text-success me-2 fs-5"></i>
              <span className="small text-secondary">Instant Confirmation & Verified Courts</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="qc-footer-divider my-4"></div>

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">QuickCourt</strong>. All rights reserved. 
            <span className="ms-2 opacity-75">| Built with <i className="bi bi-heart-fill text-danger mx-1"></i> for Odoo Hackathon</span>
          </div>
          <div className="d-flex gap-4">
            <a href="#!" className="qc-footer-sublink">Privacy Policy</a>
            <a href="#!" className="qc-footer-sublink">Terms of Service</a>
            <a href="#!" className="qc-footer-sublink">Refund Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
