const express = require("express");
const ServiceRoute = express.Router();
const serviceController = require("../Controllers/servicesController");

//---------add new service---------
ServiceRoute.post("/addService", serviceController.addService);

//---------get all services---------
ServiceRoute.get("/getAllServices", serviceController.getAllServices);

//----------get service by id---------
ServiceRoute.get("/getServiceById/:id", serviceController.getServiceById);

//--------update service---------
ServiceRoute.patch("/updateService/:id", serviceController.updateService);

//--------delete service---------
ServiceRoute.delete("/deleteService/:id", serviceController.deleteService);

module.exports = ServiceRoute;
