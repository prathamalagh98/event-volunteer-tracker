import React, { useContext, useState, useEffect } from "react";
import "./AdminVolunteer.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// <-- change this to your public backend (ngrok / deployed URL) or set REACT_APP_API_URL in env
const API_BASE = process.env.REACT_APP_API_URL || "https://event-volunteer-tracker.onrender.com/api";

const AdminVolunteers = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  const logout = authContext?.logout || (() => console.log("Logout clicked"));

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll listener for navbar effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch events with volunteers
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/events/with-volunteers`, { signal });
        if (!res.ok) {
          // server responded with non-2xx
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        // If your backend returns an object like { events: [...] } adjust accordingly
        const list = Array.isArray(data) ? data : (Array.isArray(data.events) ? data.events : []);
        setEvents(list);
      } catch (err) {
        if (err.name === "AbortError") {
          // fetch was aborted, ignore
          return;
        }
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []); // API_BASE is stable; keep empty deps to fetch once on mount

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
        <div className="logo">
          <img
            src="/video/logo.png"
            alt="Event Volunteer Tracker Logo"
            className="logo-img spin-on-hover"
          />
          <span className="logo-text">Event Volunteer Tracker</span>
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/event" onClick={() => setIsMenuOpen(false)}>Events</Link>
          </li>
          <li>
            <Link to="/adminVolunteers" onClick={() => setIsMenuOpen(false)}>Volunteers</Link>
          </li>
          {user ? (
            <>
              <li className="user-greeting">Hello, {user.name}</li>
              <li>
                <button onClick={logout} className="btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Main content */}
      <div className="container">
        <h1>Volunteers per Event</h1>

        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((ev, idx) => {
            // safe image handling: if ev.image is an absolute URL use it, else prefix with API_BASE
            const imgSrc = ev?.image
              ? (typeof ev.image === "string" && (ev.image.startsWith("http://") || ev.image.startsWith("https://")))
                ? ev.image
                : `${API_BASE}${ev.image}`
              : "/video/CleanPark.jpg";

            return (
              <div key={ev._id || ev.id || idx} className="card">
                <img
                  src={imgSrc}
                  alt={ev.title || "Event image"}
                  className="event-image"
                />

                <div className="event-info">
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                  <p>
                    <b>Date:</b>{" "}
                    {ev.date ? new Date(ev.date).toLocaleDateString() : "-"}
                  </p>
                  <p><b>Total Volunteers:</b> {ev.volunteers?.length || 0}</p>

                  <ul>
                    {(ev.volunteers || []).map((v, i) => (
                      <li key={v._id || v.email || i}>
                        {v.name ? `${v.name} (${v.email})` : (typeof v === "string" ? v : JSON.stringify(v))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminVolunteers;
