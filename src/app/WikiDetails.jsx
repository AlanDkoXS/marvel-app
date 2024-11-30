import { useParams, useLocation } from 'react-router-dom'; // Importa useLocation
import { useReducer, useEffect } from 'react';
import md5 from 'md5';
import { useAudio } from '../context/AudioContext';

const initialState = {
  character: null,
  comics: [],
  view: 'comics',
  loading: true,
  error: null,
};

function wikiDetailsReducer(state, action) {
  switch (action.type) {
    case 'SET_CHARACTER':
      return { ...state, character: action.payload, loading: false };
    case 'SET_COMICS':
      return { ...state, comics: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

const WikiDetails = () => {
  const { id } = useParams();
  const { state } = useLocation(); // Usa useLocation para acceder a los datos pasados
  const [detailsState, dispatch] = useReducer(wikiDetailsReducer, initialState);
  const { startAudio } = useAudio();

  useEffect(() => {
    startAudio();

    if (state && state.character) { // Si los datos ya están disponibles en el location state
      dispatch({ type: 'SET_CHARACTER', payload: state.character });
      if (state.character.comics.items.length > 0) {
        const ts = new Date().getTime();
        const hash = md5(ts + privateKey + publicKey);

        const fetchComics = async () => {
          const comicsData = await Promise.all(
            state.character.comics.items.map(async (comic) => {
              const response = await fetch(
                `${comic.resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
              );
              const data = await response.json();
              return data.data.results[0];
            })
          );
          dispatch({ type: 'SET_COMICS', payload: comicsData });
        };

        fetchComics();
      }
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Character details not found',
      });
    }
  }, [id, state, startAudio]); // Aquí depende de 'state' para los datos

  const handleViewChange = (viewType) => {
    dispatch({ type: 'SET_VIEW', payload: viewType });
  };

  if (detailsState.loading) return <p>Loading...</p>;
  if (detailsState.error) return <p>{detailsState.error}</p>;
  if (!detailsState.character) return <p>No details found for this character</p>;

  return (
    <div>
      <h1>{detailsState.character.name}</h1>
      <p>
        {detailsState.character.description ||
          'There is no description available for this character'}
      </p>

      <h2>Stats:</h2>
      <ul>
        <li>Comics: {detailsState.character?.comics?.available || 0}</li>
        <li>Series: {detailsState.character?.series?.available || 0}</li>
        <li>Stories: {detailsState.character?.stories?.available || 0}</li>
        <li>Events: {detailsState.character?.events?.available || 0}</li>
      </ul>

      <div>
        <button onClick={() => handleViewChange('comics')}>Show Comics</button>
        <button onClick={() => handleViewChange('stories')}>
          Show Stories
        </button>
        <button onClick={() => handleViewChange('events')}>Show Events</button>
      </div>

      {detailsState.view === 'comics' && detailsState.comics.length > 0 ? (
        <div>
          <h2>Comics:</h2>
          <div>
            {detailsState.comics.map((comic) => (
              <div key={comic.id}>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                />
                <p>{comic.title}</p>
              </div>
            ))}
          </div>
        </div>
      ) : detailsState.view === 'comics' && detailsState.comics.length === 0 ? (
        <p>There are no comics available for this character</p>
      ) : null}

      {detailsState.view === 'stories' && detailsState.character.stories.items.length > 0 ? (
        <div>
          <h2>Stories</h2>
          <ul>
            {detailsState.character.stories.items.map((story, index) => (
              <li key={index}>
                {story.thumbnail && story.thumbnail.path && (
                  <img
                    src={`${story.thumbnail.path}.${story.thumbnail.extension}`}
                    alt={story.name}
                  />
                )}
                <p>{story.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : detailsState.view === 'stories' &&
        detailsState.character.stories.items.length === 0 ? (
        <p>There are no stories available for this character</p>
      ) : null}

      {detailsState.view === 'events' && detailsState.character.events.items.length > 0 ? (
        <div>
          <h2>Events</h2>
          <ul>
            {detailsState.character.events.items.map((event, index) => (
              <li key={index}>
                {event.thumbnail && event.thumbnail.path && (
                  <img
                    src={`${event.thumbnail.path}.${event.thumbnail.extension}`}
                    alt={event.name}
                  />
                )}
                <p>{event.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : detailsState.view === 'events' &&
        detailsState.character.events.items.length === 0 ? (
        <p>There are no events available for this character</p>
      ) : null}
    </div>
  );
};

export default WikiDetails;
