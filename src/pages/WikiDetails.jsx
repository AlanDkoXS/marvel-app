import { useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import md5 from 'md5'; // Asegúrate de importar md5 correctamente
import { fetchCharacterDetails } from '../services/marvelService';
import { useAudio } from '../context/AudioContext';

// Estado inicial
const initialState = {
  character: null,
  comics: [],
  view: 'comics', // Estado para controlar qué mostrar (comics, stories o events)
  loading: true,
  error: null,
};

// Reductor
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
  const [state, dispatch] = useReducer(wikiDetailsReducer, initialState);
  const { startAudio } = useAudio(); // Usar el contexto del audio

  useEffect(() => {
    // Asegurarnos de que el audio comience cuando la página de detalles se carga
    startAudio();

    const fetchDetails = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const characterDetails = await fetchCharacterDetails(id);
        dispatch({ type: 'SET_CHARACTER', payload: characterDetails });

        // Obtener detalles de los cómics solo si hay cómics disponibles
        if (characterDetails?.comics?.items.length > 0) {
          const ts = new Date().getTime();
          const hash = md5(ts + privateKey + publicKey);

          const comicsData = await Promise.all(
            characterDetails.comics.items.map(async (comic) => {
              const response = await fetch(
                `${comic.resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
              );
              const data = await response.json();
              return data.data.results[0];
            }),
          );
          dispatch({ type: 'SET_COMICS', payload: comicsData });
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Error al cargar los detalles del personaje',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchDetails();
  }, [id, startAudio]);

  // Función para cambiar la vista (comics, stories, events)
  const handleViewChange = (viewType) => {
    dispatch({ type: 'SET_VIEW', payload: viewType });
  };

  if (state.loading) return <p>Cargando...</p>;
  if (state.error) return <p>{state.error}</p>;
  if (!state.character)
    return <p>No se encontraron detalles para este personaje.</p>;

  return (
    <div>
      <h1>{state.character.name}</h1>
      <p>
        {state.character.description ||
          'No hay descripción disponible para este personaje.'}
      </p>

      <h2>Estadísticas base:</h2>
      <ul>
        <li>Comics: {state.character?.comics?.available || 0}</li>
        <li>Series: {state.character?.series?.available || 0}</li>
        <li>Historias: {state.character?.stories?.available || 0}</li>
        <li>Eventos: {state.character?.events?.available || 0}</li>
      </ul>

      {/* Botones para cambiar entre las vistas */}
      <div>
        <button onClick={() => handleViewChange('comics')}>
          Mostrar Cómics
        </button>
        <button onClick={() => handleViewChange('stories')}>
          Mostrar Historias
        </button>
        <button onClick={() => handleViewChange('events')}>
          Mostrar Eventos
        </button>
      </div>

      {/* Mostrar Cómics */}
      {state.view === 'comics' && state.comics.length > 0 ? (
        <div>
          <h2>Cómics en los que apareció:</h2>
          <div>
            {state.comics.map((comic) => (
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
      ) : state.view === 'comics' && state.comics.length === 0 ? (
        <p>No hay cómics disponibles para este personaje.</p>
      ) : null}

      {/* Mostrar Historias */}
      {state.view === 'stories' && state.character.stories.items.length > 0 ? (
        <div>
          <h2>Historias en las que apareció:</h2>
          <ul>
            {state.character.stories.items.map((story, index) => (
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
      ) : state.view === 'stories' &&
        state.character.stories.items.length === 0 ? (
        <p>No hay historias disponibles para este personaje.</p>
      ) : null}

      {/* Mostrar Eventos */}
      {state.view === 'events' && state.character.events.items.length > 0 ? (
        <div>
          <h2>Eventos en los que apareció:</h2>
          <ul>
            {state.character.events.items.map((event, index) => (
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
      ) : state.view === 'events' &&
        state.character.events.items.length === 0 ? (
        <p>No hay eventos disponibles para este personaje.</p>
      ) : null}
    </div>
  );
};

export default WikiDetails;
