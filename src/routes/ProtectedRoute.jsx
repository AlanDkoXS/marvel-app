import { Navigate } from 'react-router';

// The app's "login" only stores a name in localStorage (see app/Home.jsx).
const ProtectedRoute = ({ children }) =>
  localStorage.getItem('user') ? children : <Navigate to="/" replace />;

export default ProtectedRoute;
