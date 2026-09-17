import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchVenues } from '../services/api';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';

const Venues = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sport, setSport] = useState(searchParams.get('sport') || '');
  const [priceMax, setPriceMax] = useState(Number(searchParams.get('price_max')) || 2000);
  const [ratingMin, setRatingMin] = useState(searchParams.get('rating_min') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'rating');
  const [page, setPage] = useState(1);

  const [facilities, setFacilities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        sport,
        price_max: priceMax,
        rating_min: ratingMin ? Number(ratingMin) : undefined,
        sort_by: sortBy,
        page,
        limit: 6
      };
      const res = await fetchVenues(params);
      setFacilities(res.data.facilities || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load venues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sport, priceMax, ratingMin, sortBy, page]);

  const handleSearchSubmit = () => {
    setPage(1);
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSport('');
    setPriceMax(2000);
    setRatingMin('');
    setSortBy('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-1">Browse Sports Facilities</h2>
            <p className="text-muted small mb-0">
              Showing {totalCount} verified sports venues in Ahmedabad
            </p>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <SearchBar search={search} setSearch={setSearch} onSearch={handleSearchSubmit} />
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3">
            <FilterPanel
              sport={sport}
              setSport={setSport}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              ratingMin={ratingMin}
              setRatingMin={setRatingMin}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={handleResetFilters}
            />
          </div>

          {/* Venues Grid */}
          <div className="col-lg-9">
            {loading ? (
              <LoadingSpinner message="Searching available courts..." />
            ) : facilities.length === 0 ? (
              <div className="qc-card p-5 text-center">
                <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h5 className="fw-bold">No Venues Found</h5>
                <p className="text-muted small">Try adjusting your filters or search terms.</p>
                <button className="btn btn-qc-outline rounded-pill" onClick={handleResetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {facilities.map((f) => (
                    <div key={f.id} className="col-md-6 col-lg-4">
                      <VenueCard facility={f} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-5 d-flex justify-content-center">
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venues;
