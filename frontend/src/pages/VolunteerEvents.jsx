import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./VolunteerEvent.css";

const VolunteerEvents = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://event-volunteer-tracker.onrender.com/api/events");
        const data = await res.json();
        console.log("Events Response:", data);
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleJoin = async (eventId) => {
    if (!userId) return alert("Please login first.");
    try {
      const res = await fetch(`https://event-volunteer-tracker.onrender.com/api/events/${eventId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      alert(data.message);
      setEvents(prev =>
        prev.map(ev => ev._id === eventId ? { ...ev, volunteers: data.volunteers } : ev)
      );
    } catch (err) { console.error(err); }
  };

  const handleLeave = async (eventId) => {
    if (!userId) return alert("Please login first.");
    try {
      const res = await fetch(`https://event-volunteer-tracker.onrender.com/api/events/${eventId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      alert(data.message);
      setEvents(prev =>
        prev.map(ev => ev._id === eventId ? { ...ev, volunteers: data.volunteers } : ev)
      );
    } catch (err) { console.error(err); }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="events-page container">
      <h1>Events</h1>
      <div className="events-grid">
        {Array.isArray(events) && events.length > 0 ? (
          events.map(event => {
            const volIds = (event.volunteers || []).map(v => v._id || v); // handle both populated and ids
            const joined = userId ? volIds.includes(userId) : false;

            return (
              <div key={event._id} className="event-card">
              <img
  src={
    event.image
      ? `https://event-volunteer-tracker.onrender.com:${event.image}`
      : "/video/CleanPark.jpg"
  }
  alt={event.title}
  className="event-image"
/>

                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : "-"}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Volunteers:</strong> {event.volunteers?.length || 0}</p>

                  {joined ? (
                    <button className="btn-leave" onClick={() => handleLeave(event._id)}>
                      Leave Event
                    </button>
                  ) : (
                    <button className="btn-join" onClick={() => handleJoin(event._id)}>
                      Join Event
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

export default VolunteerEvents;
