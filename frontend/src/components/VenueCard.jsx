import React from 'react';
import { Link } from 'react-router-dom';

const VenueCard = ({ facility }) => {
  const { id, name, sports_list, location, starting_price, avg_rating, review_count, image } = facility;

  // Sample dynamic amenity indicators for visual richness
  const defaultAmenities = [
    { icon: 'bi-lightbulb-fill', text: 'Floodlights' },
    { icon: 'bi-p-circle-fill', text: 'Parking' },
    { icon: 'bi-cup-hot-fill', text: 'Cafe' }
  ];

  return (
    <div className="qc-card h-100 d-flex flex-column">
      <div className="qc-card-img-wrapper">
        <img
          src={image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80'}
          alt={name}
          className="qc-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {/* Rating Badge Top Right */}
        <div className="position-absolute top-0 end-0 m-3">
          <span className="qc-rating-badge shadow-sm">
            <i className="bi bi-star-fill text-warning"></i> {avg_rating > 0 ? avg_rating : 'New'} ({review_count || 0})
          </span>
        </div>

        {/* Verified Badge Top Left */}
        <div className="position-absolute top-0 start-0 m-3">
          <span className="badge bg-emerald text-white fw-bold px-2.5 py-1.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-1 fs-7">
            <i className="bi bi-patch-check-fill"></i> Verified
          </span>
        </div>

        {/* Sports List Overlay Bottom Left */}
        <div className="position-absolute bottom-0 start-0 m-3 d-flex flex-wrap gap-1">
          {sports_list && sports_list.slice(0, 3).map((sport, idx) => (
            <span key={idx} className="qc-sport-pill">
              {sport}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold mb-1 text-dark text-truncate" title={name}>
          {name}
        </h5>
        
        <p className="text-muted small mb-3 text-truncate">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i> {location}
        </p>

        {/* Amenities Row */}
        <div className="d-flex flex-wrap gap-1.5 mb-3">
          {defaultAmenities.map((am, idx) => (
            <span key={idx} className="qc-amenity-pill">
              <i className={`bi ${am.icon} text-emerald`}></i> {am.text}
            </span>
          ))}
        </div>

        <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
          <div>
            <span className="text-muted fs-7 d-block">Starting from</span>
            <span className="fs-5 fw-extrabold text-emerald">₹{starting_price}</span>
            <span className="text-muted fs-7"> / hr</span>
          </div>
          
          <Link to={`/venues/${id}`} className="btn btn-qc-emerald rounded-pill btn-sm px-3.5 fw-bold d-inline-flex align-items-center gap-1">
            Book Slot <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
