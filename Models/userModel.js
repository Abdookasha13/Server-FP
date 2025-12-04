const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "instructor", "admin"],
        message: "Role must be student, instructor, or admin",
      },
      default: "student",
    },
    expertise: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
    },
    profileImage: {
      type: String,
    },
    wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }
],
  },
  { timestamps: true }
);

// -------generate salt and hash password----------
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return;
});

//------compare password for login-----------
userSchema.methods.comparePassword = function (currentUserPassword) {
  return bcrypt.compare(currentUserPassword, this.password);
};

//--------------------delete password from any response----------
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
