const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");

const router = express.Router();

// ---- Multer setup (local uploads fallback) ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---- Serve uploads folder as static ----
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ---- Create Event ----
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;

    // Priority: Cloudinary URL > local upload
    const imageUrl = image || (req.file ? `/uploads/${req.file.filename}` : null);

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      image: imageUrl,
    });

    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// ---- Get all events ----
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// ---- Get events with volunteers (admin) ----
router.get("/with-volunteers", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate("volunteers", "name email");
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events with volunteers" });
  }
});

// ---- Get single event ----
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("volunteers", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// ---- Update Event ----
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;

    const updatedData = { title, description, date, location };

    if (image) updatedData.image = image;
    else if (req.file) updatedData.image = `/uploads/${req.file.filename}`;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
});

// ---- Delete Event ----
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// ---- Join Event ----
router.post("/:id/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { volunteers: userId } },
      { new: true }
    ).populate("volunteers", "name email");

    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Joined event", volunteers: updated.volunteers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join event" });
  }
});

// ---- Leave Event ----
router.post("/:id/leave", async (req, res) => {
  try {
    const { userId } = req.body;
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $pull: { volunteers: userId } },
      { new: true }
    ).populate("volunteers", "name email");

    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Left event", volunteers: updated.volunteers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to leave event" });
  }
});

module.exports = router;
