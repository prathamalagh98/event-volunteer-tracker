// src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventDetail.css";

const API_BASE = "http://192.168.1.72:5000/api";
 // <-- use your live backend

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${id}`);
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found.</p>; // extra safety

  return (
    <div className="event-details container">
      <h1>{event.title}</h1>
      {event.image && (
        <img
          src={`https://event-volunteer-tracker.onrender.com${event.image}`}
          alt={event.title}
          style={{ maxWidth: "400px", borderRadius: "8px" }}
        />
      )}
      <p>{event.description}</p>
      <p>
        <strong>Date:</strong>{" "}
        {event.date ? new Date(event.date).toLocaleDateString() : "-"}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      {event.volunteers && event.volunteers.length > 0 && (
        <div>
          <strong>Volunteers:</strong>
          <ul>
            {event.volunteers.map((v) => (
              <li key={v._id}>{v.name} ({v.email})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
