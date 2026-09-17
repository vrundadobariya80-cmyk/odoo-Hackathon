import React from 'react';
import { Link } from 'react-router-dom';

const VenueCard = ({ facility }) => {
  const { id, name, sports_list, location, starting_price, avg_rating, review_count, image } = facility;

  return (
    <div className="qc-card h-100 d-flex flex-column">
      <div className="qc-card-img-wrapper">
        <img
          src={image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'}
          alt={name}
          className="qc-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800';
          }}
        />
        <div className="position-absolute top-0 end-0 m-3">
          <span className="qc-rating-badge shadow-sm">
            <i className="bi bi-star-fill text-warning"></i> {avg_rating > 0 ? avg_rating : 'New'} ({review_count})
          </span>
        </div>
        <div className="position-absolute bottom-0 start-0 m-3 d-flex flex-wrap gap-1">
          {sports_list && sports_list.slice(0, 3).map((sport, idx) => (
            <span key={idx} className="qc-sport-pill">
              {sport}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold mb-1 text-truncate" title={name}>{name}</h5>
        <p className="text-muted small mb-3 text-truncate">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i> {location}
        </p>

        <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
          <div>
            <span className="text-muted small d-block">Starting from</span>
            <span className="fs-5 fw-bold text-success">₹{starting_price}</span>
            <span className="text-muted small"> / hr</span>
          </div>
          <Link to={`/venues/${id}`} className="btn btn-qc-emerald rounded-pill btn-sm px-3">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
