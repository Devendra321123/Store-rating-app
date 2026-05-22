const express = require("express");
const router = express.Router();
const { submitRating } = require("../controllers/rating.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/", authenticate, authorizeRoles("USER"), submitRating);

module.exports = router;
