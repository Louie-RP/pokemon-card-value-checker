import React from 'react';
import './CardDetails.css';

// Simple skeleton loader for card + pricing layout
export const CardResultSkeleton: React.FC = () => {
  return (
    <div className="card-details-flex-container skeleton-wrapper" aria-hidden="true">
      <div className="card-details-image-col">
        <div className="skeleton-title shimmer" style={{ width: '60%', height: 28, margin: '0 auto 24px' }} />
        <div className="skeleton-card shimmer" />
      </div>
      <div className="card-details-separator d-none d-lg-block" />
      <div className="card-details-prices-col">
        <div className="card-details-prices two-col">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="price-panel skeleton shimmer" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardResultSkeleton;