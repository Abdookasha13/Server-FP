const ContactUs = require("../Models/contactUsModel");

// ---------add new contact us message---------
const addContactUsMessage = async (req, res) => {
  try {
    const contactUsMessage = new ContactUs(req.body);
    await contactUsMessage.save();
    res.status(201).json(contactUsMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// -----------get all contact us messages with localization---------
const getAllContactUsMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find();

    res.status(200).json(
      messages.length > 0 ? messages : { message: "No contact us messages found" }
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to get contact us messages", error });
  }
};

// ----------get contact us message by id with localization---------
const getContactUsMessageById = async (req, res) => {
  try {
    const message = await ContactUs.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Contact us message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to get contact us message", error });
  }
};


//--------delete contact us message---------
const deleteContactUsMessage = async (req, res) => {
  try {
    const message = await ContactUs.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Contact us message not found" });
    }
    res
      .status(200)
      .json({ message: "Contact us message deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete contact us message", error });
  }
};

// -----------mark contact us message as read---------
const markAsRead = async (req, res) => {
  try {
    const message = await ContactUs.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Contact us message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark contact us message as read", error });
  }
};

module.exports = {
  addContactUsMessage,
  getAllContactUsMessages,
  getContactUsMessageById,
  deleteContactUsMessage,
  markAsRead,
};
