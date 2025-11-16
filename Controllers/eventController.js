const Event = require("../Models/eventModel");

// ---------add new event---------
const addEvent = async (req, res) => {
  try {
    const { eventImage, title, description, date, location } = req.body;

    if (!eventImage || !title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = new Event({
      eventImage,
      title,
      description,
      date,
      location,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//---------getAllEvents---------
// Get all events with localization
const getAllEvents = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const events = await Event.find().sort({ date: 1 }).lean();

    if (!events || events.length === 0) {
      return res.status(200).json([]);
    }

    // Localize response
    const localizedEvents = events.map((event) => ({
      _id: event._id,
      eventImage: event.eventImage,
      title: event.title?.[lang] || event.title?.en,
      description: event.description?.[lang] || event.description?.en,
      location: event.location?.[lang] || event.location?.en,
      date: event.date,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    res.status(200).json(localizedEvents);
  } catch (error) {
    res.status(500).json({ message: "Failed to get events" });
  }
};

//----------get event by id---------
const getEventById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const localizedEvent = {
      _id: event._id,
      eventImage: event.eventImage,

      title: event.title?.[lang] || event.title?.en,
      description: event.description?.[lang] || event.description?.en,
      location: event.location?.[lang] || event.location?.en,

      date: event.date,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    res.status(200).json(localizedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to get event" });
  }
};


//--------update event---------
const updateEvent = async (req, res) => {
  try {
    const { eventImage, title, description, date, location } = req.body;
    const update = { eventImage, title, description, date, location };
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
    const event = await Event.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
};

//--------delete event---------
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
