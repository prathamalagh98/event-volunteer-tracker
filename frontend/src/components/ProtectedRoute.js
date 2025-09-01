import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);

    // ✅ Not logged in → redirect
    if (!user) return <Navigate to = "/login" / > ;

    // ✅ Role mismatch → redirect
    if (role && user.role !== role) return <Navigate to = "/" / > ;

    // ✅ Authorized → render the component
    return children;
};

export default ProtectedRoute;