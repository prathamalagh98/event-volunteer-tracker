import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/volunteer"} replace />;
  }
  return children;
};

export default PublicOnlyRoute;
