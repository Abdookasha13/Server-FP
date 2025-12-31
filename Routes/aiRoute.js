const express = require("express");
const router = express.Router();
const { autoReply, generateQuiz } = require("../Controllers/aiController");

router.post("/ai/auto-reply", autoReply);
router.post("/quiz/generate", generateQuiz);

module.exports = router;