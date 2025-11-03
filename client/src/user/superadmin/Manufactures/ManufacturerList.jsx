import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllManufacturers } from './manufacturersData';
import './ManufacturersList.css';

const ManufacturersList = () => {
  const navigate = useNavigate();
  const manufacturers = getAllManufacturers();

  const handleViewDetails = (manufacturerId) => {
    navigate(`/superadmin/manufacturers/${manufacturerId}`);
  };
  

  return (
    <div className="manufacturers-list">
      <div className="manufacturers-header">
        <h1>Manufacturers Directory</h1>
        <p>Browse our trusted manufacturing partners</p>
      </div>
      
      <div className="manufacturers-grid">
        {manufacturers.map(manufacturer => (
          <div key={manufacturer.id} className="manufacturer-card">
            <div className="card-image">
              <img src={manufacturer.image} alt={manufacturer.name} />
         
              <div className="rating-badge">
                ⭐ {manufacturer.rating}
              </div>
            </div>
            
            <div className="card-content">
              <h3>{manufacturer.name}</h3>
              <div className="manufacturer-meta">
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{manufacturer.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Specialization:</span>
                  <span className="meta-value">{manufacturer.specialization}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Established:</span>
                  <span className="meta-value">{manufacturer.established}</span>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-number">{manufacturer.productsCount}</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{manufacturer.employees}+</span>
                  <span className="stat-label">Employees</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{manufacturer.exportCountries}</span>
                  <span className="stat-label">Countries</span>
                </div>
              </div>

              <div className="turnover-badge">
                {manufacturer.turnover}
              </div>

              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(manufacturer.id)}
              >
                View Details & Products
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturersList;