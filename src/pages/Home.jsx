// src/pages/Home.jsx
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// Definir el estado inicial y el reductor
const initialState = {
  name: '',
};

function homeReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    default:
      return state;
  }
}

const Home = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState); // Usar useReducer
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.name) {
      localStorage.setItem('user', state.name); // Guardar nombre en localStorage
      navigate('/wiki');
    }
  };

  return (
    <div>
      <h1>Bienvenido a la aplicación de Marvel</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Ingresa tu nombre:
          <input
            type="text"
            value={state.name}
            onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })} // Actualizar el estado con dispatch
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Home;
