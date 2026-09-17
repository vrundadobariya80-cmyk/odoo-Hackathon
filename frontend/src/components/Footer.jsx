import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="qc-footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-warning"></i>
              Quick<span className="text-success">Court</span>
            </h5>
            <p className="text-muted small">
              QuickCourt is a modern local sports facility booking platform. Discover sports venues, select available courts, and book your slots instantly in Ahmedabad and beyond.
            </p>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Explore</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/venues">All Venues</Link></li>
              <li><Link to="/venues?sport=Badminton">Badminton Courts</Link></li>
              <li><Link to="/venues?sport=Football">Football Turfs</Link></li>
              <li><Link to="/venues?sport=Cricket">Cricket Arenas</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>For Partners</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/signup?role=owner">List Your Facility</Link></li>
              <li><Link to="/login">Owner Portal</Link></li>
              <li><Link to="/login">Admin Access</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Contact & Support</h5>
            <p className="small mb-1"><i className="bi bi-geo-alt me-2 text-success"></i> Ahmedabad, Gujarat, India</p>
            <p className="small mb-1"><i className="bi bi-envelope me-2 text-success"></i> support@quickcourt.com</p>
            <p className="small"><i className="bi bi-telephone me-2 text-success"></i> +91 98765 43210</p>
          </div>
        </div>
        <hr className="border-secondary opacity-25" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <div>&copy; {new Date().getFullYear()} QuickCourt. All rights reserved. Built for Odoo Hackathon.</div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <a href="#!"><i className="bi bi-facebook fs-5"></i></a>
            <a href="#!"><i className="bi bi-instagram fs-5"></i></a>
            <a href="#!"><i className="bi bi-twitter-x fs-5"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
