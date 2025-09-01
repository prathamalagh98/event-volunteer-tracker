import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import LoadingPage from "./pages/LoadingPage"; // <-- new loading page import

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render( <
    React.StrictMode >
    <
    AuthProvider > { /* App ko LoadingPage ke andar wrap karo */ } <
    LoadingPage >
    <
    App / >
    <
    /LoadingPage> <
    /AuthProvider> <
    /React.StrictMode>
);