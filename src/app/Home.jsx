import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';

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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.name) {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('user', state.name);
        setUser(state.name);
        setLoading(false);
        navigate('/wiki');
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleGoToWiki = () => {
    navigate('/wiki');
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome back, {user}!</h1>
          <button onClick={handleGoToWiki}>Enter</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Welcome to Marvel Universe</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Enter your name:
              <input
                style={{ marginLeft: '.5rem' }}
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: 'SET_NAME', payload: e.target.value })
                }
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Send'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Home;
