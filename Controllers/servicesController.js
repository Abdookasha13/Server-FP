const Services = require("../Models/servicesModel");

// ---------add new service---------
const addService = async (req, res) => {
  try {
    const { icon, title, description } = req.body;

    if (!icon || !title?.en || !title?.ar || !description?.en || !description?.ar) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const service = new Services({ icon, title, description });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to add service", error: error.message });
  }
};

//---------getAllServices with localization---------
const getAllServices = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const services = await Services.find().lean();

    if (!services || services.length === 0) return res.status(200).json([]);

    const localizedServices = services.map(service => ({
      _id: service._id,
      icon: service.icon,
      title: service.title?.[lang] || service.title?.en,
      description: service.description?.[lang] || service.description?.en,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    }));

    res.status(200).json(localizedServices);
  } catch (error) {
    res.status(500).json({ message: "Failed to get services", error: error.message });
  }
};

//----------get service by id with localization---------
const getServiceById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const service = await Services.findById(req.params.id).lean();
    if (!service) return res.status(404).json({ message: "Service not found" });

    const localizedService = {
      _id: service._id,
      icon: service.icon,
      title: service.title?.[lang] || service.title?.en,
      description: service.description?.[lang] || service.description?.en,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };

    res.status(200).json(localizedService);
  } catch (error) {
    res.status(500).json({ message: "Failed to get service", error: error.message });
  }
};

//--------update service---------
const updateService = async (req, res) => {
  try {
    const { icon, title, description } = req.body;
    const update = { icon, title, description };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

    const service = await Services.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error: error.message });
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
