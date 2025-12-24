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
      name: user.name,
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

    console.log("Login request:", req.body);
    const user = await User.findOne({ email });
    console.log("User from DB:", user);
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

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // جايّ من الـ auth middleware
    const { courseId } = req.body;

    const user = await User.findById(userId);

    // لو مش موجود قبل كده
    if (!user.wishlist.includes(courseId)) {
      user.wishlist.push(courseId);
      await user.save();
    }

    return res.status(200).json({ message: "Course added to wishlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const user = await User.findById(userId);

    if (user.wishlist.includes(courseId)) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== courseId);
      await user.save();
    }

    return res.status(200).json({ message: "Course removed from wishlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const getWishlist = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate("wishlist")
    .populate({
      path: "wishlist",
      populate: [
        {
          path: "instructor",
          select: "name profileImage",
        },
        {
          path: "lessons",
          select: "duration",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });

  res.status(200).json({ wishlist: user.wishlist });
};

//------------- get all instructors (public) -------------
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select(
      "-password"
    );

    res.status(200).json({
      count: instructors.length,
      instructors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching instructors" });
  }
};

// -------------------get instructor by id (public)-------------
const getInstructorById = async (req, res) => {
  const instructor = await User.findOne({
    _id: req.params.id,
    role: "instructor",
  }).select("-password");

  if (!instructor) {
    return res.status(404).json({ message: "Instructor not found" });
  }

  res.json(instructor);
};

// --------------------send email------------------
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// ----------------forget password-------------------
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONT_URL}/reset/password/${resetToken}`;

  const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// ----------------reset password-------------------
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

//-----------export functions-----------
module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  setUserRole,
  addToWishlist,
  getWishlist,
  getAllInstructors,
  getInstructorById,
  removeFromWishlist,
  generateToken,
  forgotPassword,
  resetPassword,
};
