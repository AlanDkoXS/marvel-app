import React from 'react';
import '../assets/styles/WikiDetails.css'

const Series = ({ series }) => {
  return (
    <div className="series">
      {series.length > 0 ? (
        series.map((serie) => (
          <div key={serie.id} className="serie">
            <img
              src={`${serie.thumbnail.path}.${serie.thumbnail.extension}`}
              alt={serie.title}
              className="serie__image"
            />
            <p>{serie.title}</p>
          </div>
        ))
      ) : (
        <p>No series available</p>
      )}
    </div>
  );
};

export default Series;
