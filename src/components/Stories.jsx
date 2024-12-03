import React from 'react';

const Stories = ({ stories }) => {
  return (
    <div className="stories">
      {stories.length > 0 ? (
        stories.map((story) => (
          <div key={story.id} className="story">
            <h3>{story.title}</h3>
            <p>{story.description || 'No description available'}</p>
          </div>
        ))
      ) : (
        <p>No stories available</p>
      )}
    </div>
  );
};

export default Stories;
