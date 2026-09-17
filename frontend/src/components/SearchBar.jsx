import React from 'react';

const SearchBar = ({ search, setSearch, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0 shadow-none"
          placeholder="Search by venue name, location (e.g. Bodakdev, Satellite), or sport..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-qc-emerald px-4">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
