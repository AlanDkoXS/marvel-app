import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.name) {
      localStorage.setItem('user', state.name);
      navigate('/wiki');
    }
  };

  return (
    <div>
      <h1>Welcome to the Marvel app</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input
            type="text"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: 'SET_NAME', payload: e.target.value })
            }
            required
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Home;
