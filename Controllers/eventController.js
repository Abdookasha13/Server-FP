const Event = require("../Models/eventModel");

// ---------add new event---------
const addEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//---------getAllEvents---------
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res
      .status(200)
      .json(events.length > 0 ? events : { message: "No events found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to get events", error });
  }
};

//----------get event by id---------
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to get event", error });
  }
};

//--------update event---------
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error });
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
    res.status(500).json({ message: "Failed to delete event", error });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
