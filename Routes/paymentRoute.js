const express = require("express");
const router = express.Router();
const axios = require("axios");
const Course = require("../Models/courseModel");
const authenticate = require("../middleware/authenticationMiddleware");
const Cart = require("../Models/cartModel");

require("dotenv").config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

// --------------- Get PayPal Access Token ----------------
async function getPayPalAccessToken() {
  const response = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

// ---------------- Create Order ----------------
router.post("/create-order", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const courseIds = items.map((i) => i.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (!courses.length) {
      return res.status(400).json({ message: "No courses found" });
    }

    // Calculate total
    const total = courses.reduce(
      (sum, c) => sum + Number(c.discountPrice ?? c.price),
      0
    );
    console.log("Calculated total:", total);
    if (total <= 0) return res.status(400).json({ message: "Invalid total" });

    const accessToken = await getPayPalAccessToken();
    console.log("PayPal Access Token obtained", accessToken);

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "COURSE_PAYMENT",
          description: "Online Courses Purchase",
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            // breakdown: {
            //   item_total: {
            //     currency_code: "USD",
            //     value: total.toFixed(2),
            //   },
            // },
          },
        },
      ],
    };

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Order created:", response.data.id);
    res.json({ id: response.data.id });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: "Create order failed",
      paypalError: err.response?.data,
    });
  }
});

// ---------------- Capture Order ----------------
router.post("/capture-order", authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) return res.status(400).json({ message: "Order ID required" });
    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Capture response:", response.data);

    if (response.data.status !== "COMPLETED") {
      return res.status(422).json({
        message: "Capture failed",
        paypalError: response.data,
      });
    }

    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });

    res.json(response.data);
  } catch (err) {
    console.error("CAPTURE ORDER ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: "Capture failed",
      paypalError: err.response?.data,
    });
  }
});

module.exports = router;
