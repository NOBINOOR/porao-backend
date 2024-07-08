const express = require("express");
const { sendMessage, fetchMessages } = require("../controllers/message.controller");
const { authenticate } = require("../middleware/authenticate");
const router = express.Router();


router.post("/send/:receiverId", authenticate, sendMessage);
router.get("/get/:id", authenticate,fetchMessages);
module.exports = router;