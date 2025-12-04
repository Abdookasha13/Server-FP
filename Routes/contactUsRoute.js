const express = require('express');
const contactUsRoute = express.Router();
const contactUsController = require('../Controllers/contactUsController');

//---------add new contact us message---------
contactUsRoute.post('/addContactUsMessage', contactUsController.addContactUsMessage);

//---------get all contact us messages---------
contactUsRoute.get('/getAllContactUsMessages', contactUsController.getAllContactUsMessages);

//----------get contact us message by id---------
contactUsRoute.get('/getContactUsMessageById/:id', contactUsController.getContactUsMessageById);

// -----------mark contact us message as read---------
contactUsRoute.patch('/markAsRead/:id', contactUsController.markAsRead);

//--------delete contact us message---------
contactUsRoute.delete('/deleteContactUsMessage/:id', contactUsController.deleteContactUsMessage);

module.exports = contactUsRoute;