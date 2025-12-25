const Cart = require("../Models/cartModel");

const formatDuration = (lessons) => {
  if (!lessons || lessons.length === 0) {
    return "0 m";
  }

  const totalMinutes = lessons.reduce((sum, lesson) => {
    const duration = lesson.duration || 0;
    return sum + duration;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};
// ---------------- Helper to format cart items ----------------
// const formatCartItems = (cart) => {
//   return cart.items.map((item) => {
//     const course = item.course;
//     const courseDuration = formatDuration(course.lessons);
//     return {
//       courseId: course._id,
//       title: course.title,
//       price: course.price,
//       discountPrice: course.discountPrice,
//       thumbnailUrl: course.thumbnailUrl,
//       insName: course.instructor?.name || "Unknown Instructor",
//       lessonsCount: course.lessons?.length || 0,
//       courseDuration: courseDuration,
//       quantity: item.quantity,
//     };
//   });
// };

const formatCartItems = (cart) => {
  if (!cart || !cart.items) return [];

  return cart.items
    .filter((item) => item.course)
    .map((item) => {
      const course = item.course;

      const lessons = Array.isArray(course.lessons) ? course.lessons : [];

      const courseDuration = formatDuration(lessons);

      return {
        courseId: course._id,
        title: course.title,
        price: course.price,
        discountPrice: course.discountPrice,
        thumbnailUrl: course.thumbnailUrl,
        insName: course.instructor?.name || "Unknown Instructor",
        lessonsCount: lessons.length,
        courseDuration,
        quantity: item.quantity,
      };
    });
};

// ---------------- Add Course to Cart ----------------
exports.addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "Course ID required" });
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "User not authenticated" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(
      (i) => i.course.toString() === courseId
    );
    if (itemIndex > -1) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    cart.items.push({ course: courseId });
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.course",
      populate: [
        { path: "instructor", select: "name" },
        { path: "lessons", select: "duration" },
      ],
    });

    const items = formatCartItems(updatedCart);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Remove Course from Cart ----------------
exports.removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId)
      return res.status(400).json({ message: "Course ID required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.course.toString() !== courseId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.course",
      populate: [
        { path: "instructor", select: "name" },
        { path: "lessons", select: "duration" },
      ],
    });

    const items = formatCartItems(updatedCart);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ----------------- Get cart -----------------
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.course",
      populate: [
        { path: "instructor", select: "name" },
        { path: "lessons", select: "duration" },
      ],
    });

    if (!cart) return res.json({ items: [] });

    const items = formatCartItems(cart);

    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Clear Cart ----------------
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
