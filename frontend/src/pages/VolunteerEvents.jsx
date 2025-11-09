// src/pages/VolunteerEvents.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./VolunteerEvent.css";

const VolunteerEvents = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const userId = user?._id;

  // navbar states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://event-volunteer-tracker.onrender.com/api/events");
        if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleJoin = async (eventId) => {
    if (!userId) return alert("Please login first.");
    try {
      const res = await fetch(
        `https://event-volunteer-tracker.onrender.com/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      alert(data.message);
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId ? { ...ev, volunteers: data.volunteers } : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to join event.");
    }
  };

  const handleLeave = async (eventId) => {
    if (!userId) return alert("Please login first.");
    try {
      const res = await fetch(
        `https://event-volunteer-tracker.onrender.com/api/events/${eventId}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      alert(data.message);
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId ? { ...ev, volunteers: data.volunteers } : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to leave event.");
    }
  };

  if (loading) return <p className="loading">Loading events...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      {/* ===== NAVBAR START ===== */}
      {isMenuOpen && <div className="nav-backdrop" onClick={closeMenu}></div>}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
        <div className="logo" onClick={() => navigate("/VolunteerEvent")} style={{ cursor: "pointer" }}>
          <img
            src="/video/logo.png"
            alt="Event Volunteer Tracker Logo"
            className="logo-img spin-on-hover"
          />
          <span className="logo-text">Event Volunteer Tracker</span>
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span><span></span><span></span>
          {user?.role === "volunteer" && <span className="volunteer-indicator"></span>}
        </button>

        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/VolunteerEvent" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/VolunteerEvents" onClick={closeMenu}>Events</Link></li>
          <li><Link to="/volunteers" onClick={closeMenu}>Upcoming Events</Link></li>
          {user ? (
            <>
              <li className="user-greeting">Hello, {user.name}</li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="btn-logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/" onClick={closeMenu}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>
      {/* ===== NAVBAR END ===== */}

      {/* EVENTS SECTION */}
      <div className="events-page container" style={{ paddingTop: "6.5rem" }}>
        <h1>Events</h1>
        <div className="events-grid">
          {events.length > 0 ? (
            events.map((event) => {
              const volIds = (event.volunteers || []).map((v) => v._id || v);
              const joined = userId ? volIds.includes(userId) : false;

              return (
                <div key={event._id} className="event-card">
                  <img
                    src={
                      event.image
                        ? `https://event-volunteer-tracker.onrender.com${event.image}`
                        : "/video/CleanPark.jpg"
                    }
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Volunteers:</strong>{" "}
                      {event.volunteers?.length || 0}
                    </p>

                    {joined ? (
                      <button
                        className="btn-leave"
                        onClick={() => handleLeave(event._id)}
                      >
                        Leave Event
                      </button>
                    ) : (
                      <button
                        className="btn-join"
                        onClick={() => handleJoin(event._id)}
                      >
                        Join Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default VolunteerEvents;
