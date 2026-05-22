const express = require("express");
const router = express.Router();
const { getAllStores } = require("../controllers/store.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, getAllStores);

module.exports = router;
