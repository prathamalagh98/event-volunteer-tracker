const Event = require("../models/Event");

const createEvent = async(req, res) => {
    try {
        const { title, description, date, location, image } = req.body;

        if (!title || !date) { // required fields check
            return res.status(400).json({ message: "Title and Date are required" });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            image
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create event" });
    }
};

module.exports = { createEvent, getEvents };