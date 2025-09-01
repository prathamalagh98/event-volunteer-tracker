import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: null,
    setUser: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // (optional) reload par user ko localStorage se wapas laa lo
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch (_) {}
        }
    }, []);

    // user change par localStorage update
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return ( <
        AuthContext.Provider value = {
            { user, setUser, logout } } > { children } <
        /AuthContext.Provider>
    );
};