import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { state } = useUser();
  return state.user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
