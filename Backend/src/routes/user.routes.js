const express = require("express");
const router = express.Router();
const { updatePassword, getProfile } = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/profile", authenticate, getProfile);
router.put("/password", authenticate, updatePassword);

module.exports = router;
