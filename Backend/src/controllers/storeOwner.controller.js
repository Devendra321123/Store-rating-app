const prisma = require("../utils/prisma");

async function getMyStoreDashboard(req, res) {
  const ownerId = req.user.id;
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    const avg =
      store.ratings.length > 0
        ? store.ratings.reduce((s, r) => s + r.value, 0) / store.ratings.length
        : 0;

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: parseFloat(avg.toFixed(1)),
      ratings: store.ratings.map((r) => ({
        id: r.id,
        value: r.value,
        userName: r.user.name,
        userEmail: r.user.email,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getMyStoreDashboard };
