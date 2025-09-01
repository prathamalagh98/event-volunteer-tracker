import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Auth from "./pages/Auth";
import AdminDashboard from "./pages/Website";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerEvents from "./pages/VolunteerEvents";
import Event from "./pages/Event";
import EventDetail from "./pages/EventDetail";
import AdminVolunteers from "./pages/AdminVolunteers"; // <— NEW

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
    return ( <
        AuthProvider >
        <
        Router >
        <
        Routes > { /* Public */ } <
        Route path = "/"
        element = { < PublicOnlyRoute > < Auth / > < /PublicOnlyRoute>} / >

            { /* Admin main page */ } <
            Route path = "/admin"
            element = { <
                ProtectedRoute allowedRoles = {
                    ["admin"]
                } >
                <
                AdminDashboard / >
                <
                /ProtectedRoute>
            }
            />

            { /* Admin: event + volunteers view */ } <
            Route path = "/AdminVolunteers"
            element = { <
                ProtectedRoute allowedRoles = {
                    ["admin"]
                } >
                <
                AdminVolunteers / >
                <
                /ProtectedRoute>
            }
            />

            { /* Volunteer area */ } <
            Route path = "/volunteer"
            element = { <
                ProtectedRoute allowedRoles = {
                    ["volunteer"]
                } >
                <
                VolunteerDashboard / >
                <
                /ProtectedRoute>
            }
            /> <
            Route path = "/VolunteerEvents"
            element = { <
                ProtectedRoute allowedRoles = {
                    ["volunteer"]
                } >
                <
                VolunteerEvents / >
                <
                /ProtectedRoute>
            }
            />

            { /* Common */ } <
            Route path = "/event"
            element = { < Event / > }
            /> <
            Route path = "/events/:id"
            element = { < EventDetail / > }
            />

            { /* Fallback */ } <
            Route path = "*"
            element = { < Navigate to = "/"
                replace / >
            }
            /> < /
            Routes > <
            /Router> < /
            AuthProvider >
        );
    }

    export default App;