const prisma = require("../utils/prisma");

async function getAllStores(req, res) {
  const { name, address } = req.query;
  try {
    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        address: address ? { contains: address } : undefined,
      },
      include: {
        ratings: true,
      },
    });

    // Calculate average rating and attach user's own rating
    const userId = req.user?.id;
    const result = stores.map((store) => {
      const avg =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
          : 0;
      const userRating = userId
        ? store.ratings.find((r) => r.userId === userId)?.value || null
        : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: parseFloat(avg.toFixed(1)),
        userRating,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllStores };
