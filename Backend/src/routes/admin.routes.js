const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");
const {
  getDashboard,
  createUser,
  getAllUsers,
  getUserById,
  getAllStores,
  createStore,
} = require("../controllers/admin.controller");
const { getMyStoreDashboard } = require("../controllers/storeOwner.controller");

// Admin routes
router.get("/dashboard", authenticate, authorizeRoles("ADMIN"), getDashboard);
router.post("/users", authenticate, authorizeRoles("ADMIN"), createUser);
router.get("/users", authenticate, authorizeRoles("ADMIN"), getAllUsers);
router.get("/users/:id", authenticate, authorizeRoles("ADMIN"), getUserById);
router.get("/stores", authenticate, authorizeRoles("ADMIN"), getAllStores);
router.post("/stores", authenticate, authorizeRoles("ADMIN"), createStore);

// Store owner route
router.get("/my-store", authenticate, authorizeRoles("STORE_OWNER"), getMyStoreDashboard);

module.exports = router;
