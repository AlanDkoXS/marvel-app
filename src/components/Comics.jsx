import React from 'react';
import '../assets/styles/WikiDetails.css'

const Comics = ({ comics }) => {
  return (
    <div className="comics">
      {comics.length > 0 ? (
        comics.map((comic) => (
          <div key={comic.id} className="comic">
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
            />
            <p>{comic.title}</p>
          </div>
        ))
      ) : (
        <p>No comics available</p>
      )}
    </div>
  );
};

export default Comics;
