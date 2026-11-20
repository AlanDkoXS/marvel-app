import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import '../assets/styles/Home.css';

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
    <Layout>
      <div className="panel home">
        {user ? (
          <>
            <h1>Welcome back, {user}!</h1>
            <p className="home__bubble">Ready for another adventure?</p>
            <div className="home__actions">
              <button onClick={handleGoToWiki}>Enter</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to the Marvel Universe</h1>
            <p className="home__bubble">Who goes there, hero?</p>
            <form className="home__form" onSubmit={handleSubmit}>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: 'SET_NAME', payload: e.target.value })
                }
                autoComplete="given-name"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Enter'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
