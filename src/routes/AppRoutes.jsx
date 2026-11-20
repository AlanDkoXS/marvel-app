import { Route, Routes } from 'react-router';
import Home from '../app/Home';
import Wiki from '../app/Wiki';
import WikiDetails from '../app/WikiDetails';
import ProtectedRoute from './ProtectedRoute';
import { AudioProvider } from '../context/AudioContext';
import { BackgroundProvider } from '../context/BackgroundContext';
import '../assets/styles/App.css';

function AppRoutes() {
  return (
    <AudioProvider>
      <BackgroundProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/wiki"
            element={
              <ProtectedRoute>
                <Wiki />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wiki/:slug"
            element={
              <ProtectedRoute>
                <WikiDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BackgroundProvider>
    </AudioProvider>
  );
}

export default AppRoutes;
