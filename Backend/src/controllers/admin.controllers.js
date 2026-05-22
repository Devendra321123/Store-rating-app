const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

async function getDashboard(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createUser(req, res) {
  const { name, email, password, address, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, address, role },
    });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllUsers(req, res) {
  const { name, email, address, role } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        address: address ? { contains: address } : undefined,
        role: role ? role : undefined,
      },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserById(req, res) {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let storeRating = null;
    if (user.role === "STORE_OWNER") {
      const store = await prisma.store.findUnique({
        where: { ownerId: id },
        include: { ratings: true },
      });
      if (store && store.ratings.length > 0) {
        storeRating = parseFloat(
          (store.ratings.reduce((s, r) => s + r.value, 0) / store.ratings.length).toFixed(1)
        );
      }
    }

    res.json({ ...user, storeRating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllStores(req, res) {
  const { name, email, address } = req.query;
  try {
    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        address: address ? { contains: address } : undefined,
      },
      include: { ratings: true },
    });

    const result = stores.map((store) => {
      const avg =
        store.ratings.length > 0
          ? store.ratings.reduce((s, r) => s + r.value, 0) / store.ratings.length
          : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: parseFloat(avg.toFixed(1)),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;
  try {
    const store = await prisma.store.create({
      data: { name, email, address, ownerId: parseInt(ownerId) },
    });
    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getDashboard, createUser, getAllUsers, getUserById, getAllStores, createStore };
