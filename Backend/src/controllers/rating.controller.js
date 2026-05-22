const prisma = require("../utils/prisma");

async function submitRating(req, res) {
  const { storeId, value } = req.body;
  const userId = req.user.id;

  if (value < 1 || value > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    // Upsert: create or update rating
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { value },
      create: { userId, storeId, value },
    });
    res.json({ message: "Rating submitted", rating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { submitRating };
