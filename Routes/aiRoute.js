const express = require("express");
const router = express.Router();
const { autoReply } = require("../Controllers/aiController");

router.post("/ai/auto-reply", autoReply);

module.exports = router;