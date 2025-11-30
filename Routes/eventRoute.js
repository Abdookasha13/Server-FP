const express = require("express");
const eventRoute = express.Router();
const eventController = require("../Controllers/eventController");

//---------add new event---------
eventRoute.post("/addEvent", eventController.addEvent);

//---------get all events---------
eventRoute.get("/getAllEvents", eventController.getAllEvents);

//----------get event by id---------
eventRoute.get("/getEventById/:id", eventController.getEventById);

//--------update event---------
eventRoute.patch("/updateEvent/:id", eventController.updateEvent);

//--------delete event---------
eventRoute.delete("/deleteEvent/:id", eventController.deleteEvent);
module.exports = eventRoute;
