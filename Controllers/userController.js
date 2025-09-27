const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

//--------------generate token---------
function generateToken(user) {
  return jwt.sign(
    {
      //----payload-------
      id: user._id,
      email: user.email,
      role: user.role,
    },
    //-------secret---------
    process.env.JWT_SECRET
  );
}

//------- register -----------
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      message: "User registered successfully",
      user: { ...user.toObject(), password: undefined },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

//---------- login------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      user: { ...user.toObject(), password: undefined },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

//-------------get all users---------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

//------------ get user by id------------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

//------------ delete user by id------------
const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

//----------------updare user -----------------
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    const user = await User.findByIdAndUpdate(req.params.id, updates).select(
      "-password"
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

//----------------put user------------
// const replaceProductById = async (req, res) => {
//   const id = req.params.id;
//   const updatedProduct = req.body;
//   const oldProduct = await Product.findById(id);
//   const newProduct = await Product.findOneAndReplace(
//     oldProduct,
//     updatedProduct
//   );
//   res.json(newProduct);
// };

//-----------export functions-----------
module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
};
