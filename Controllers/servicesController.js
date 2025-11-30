const Services = require("../Models/servicesModel");

// ---------add new service---------
const addService = async (req, res) => {
  try {
    const service = new Services(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to add service", error });
  }
};

//---------getAllServices---------
const getAllServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to get services", error });
  }
};

//----------get service by id---------
const getServiceById = async (req, res) => {
  try {
    const service = await Services.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to get service", error });
  }
};

//--------update service---------
const updateService = async (req, res) => {
  try {
    const service = await Services.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error });
  }
};

//--------delete service---------
const deleteService = async (req, res) => {
  try {
    const service = await Services.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error });
  }
};

module.exports = {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
