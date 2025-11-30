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
    const { name, email, password, role, expertise, experience, profileImage } =
      req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const userData = { name, email, password, role, profileImage };

    if (role === "instructor") {
      userData.expertise = expertise || "";
      userData.experience = experience || 0;
    }

    const user = new User(userData);
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: user,
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
      user: user,
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
    //--------------allow only to admin or the user themself to get user info-------------
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

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
    //--------------allow delete only to admin or the user themself-------------
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

//----------------update user -----------------
const updateUser = async (req, res) => {
  try {
    //-------------------allow update only to admin or the user themself-------------
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = { ...req.body };
    //----------------- prevent non admins from changing the role field--------------
    if (!req.user || req.user.role !== "admin") {
      delete updates.role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

//-------------admin only set user role (promote a student to instructor)
const setUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["student", "instructor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("setUserRole error:", err);
    res.status(500).json({ message: "Error setting user role" });
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
  setUserRole,
};
