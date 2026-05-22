const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

async function updatePassword(req, res) {
  const { newPassword } = req.body;
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { updatePassword, getProfile };
