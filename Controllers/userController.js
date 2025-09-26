const User = require("../Models/userModel");

//-------add user-----------
const creatUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
};

//-------------get all users---------
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

//------------ get user by id------------
const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  res.json(user);
};

//------------ delete user by id------------
const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  res.send("user deleted");
};

//-----------export functions-----------
module.exports = { creatUser, getAllUsers, getUserById };
