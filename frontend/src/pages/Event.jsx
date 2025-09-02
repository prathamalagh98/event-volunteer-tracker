import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

// Correct backend API base
const API_BASE = "https://event-volunteer-tracker.onrender.com/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = true; // admin functionalities

  // Add Event form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Edit Event state
  const [editingEvent, setEditingEvent] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  // ---- Fetch events ----
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = isAdmin
          ? `${API_BASE}/events/with-volunteers`
          : `${API_BASE}/events`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isAdmin]);

  const resetAddForm = () => {
    setNewEvent({ title: "", description: "", date: "", location: "" });
    setImageFile(null);
    setPreview(null);
  };

  // ---- Add Event ----
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", newEvent.title);
      fd.append("description", newEvent.description);
      fd.append(
        "date",
        newEvent.date ? new Date(newEvent.date).toISOString() : ""
      );
      fd.append("location", newEvent.location);
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Create failed");

      const created = await res.json();
      setEvents((prev) => [...prev, created]);
      setShowAddForm(false);
      resetAddForm();
    } catch (err) {
      console.error("Add event error:", err);
      alert("Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete Event ----
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Failed to delete event");
    }
  };

  // ---- Edit Event ----
  const openEdit = (event) => {
    setEditingEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    });
    setEditPreview(event.image ? `${API_BASE}${event.image}` : null);
    setEditImageFile(null);
  };

  const closeEdit = () => {
    setEditingEvent(null);
    setEditImageFile(null);
    setEditPreview(null);
  };

  const saveEdit = async () => {
    if (!editingEvent) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", editingEvent.title);
      fd.append("description", editingEvent.description);
      fd.append(
        "date",
        editingEvent.date ? new Date(editingEvent.date).toISOString() : ""
      );
      fd.append("location", editingEvent.location);
      if (editImageFile) fd.append("image", editImageFile);

      const res = await fetch(`${API_BASE}/events/${editingEvent._id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      closeEdit();
    } catch (err) {
      console.error("Edit event error:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-page container">
      <div className="events-header">
        <h1>All Events</h1>
        {isAdmin && (
          <button onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? "Close" : "+ Add Event"}
          </button>
        )}
      </div>

      {/* Add Event Form */}
      {isAdmin && showAddForm && (
        <form className="card add-form" onSubmit={handleAddSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea
              required
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label>Date</label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Location</label>
              <input
                type="text"
                required
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="preview" />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Create Event"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="events-grid">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={
                  event.image
                    ? `${API_BASE}${event.image}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={event.title}
                className="event-image"
              />
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {event.date ? new Date(event.date).toLocaleDateString() : "-"}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <div className="card-actions">
                  <Link to={`/events/${event._id}`} className="btn-view-event">
                    View Details
                  </Link>
                  {isAdmin && (
                    <div className="admin-actions">
                      <button onClick={() => openEdit(event)}>Edit</button>
                      <button onClick={() => handleDelete(event._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Event</h2>
            <div className="form-row">
              <label>Title</label>
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, description: e.target.value })
                }
              />
            </div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>Date</label>
                <input
                  type="date"
                  value={editingEvent.date || ""}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                 
                  }
                />
              </div>
              <div className="form-row">
                <label>Location</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setEditImageFile(file);
                  setEditPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              {editPreview && (
                <div className="image-preview">
                  <img src={editPreview} alt="preview" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={closeEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
