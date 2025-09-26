const User = require("../Models/userModel");

//-------add user-----------
const creatUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
};

//-----------export functions-----------
module.exports = { creatUser };
