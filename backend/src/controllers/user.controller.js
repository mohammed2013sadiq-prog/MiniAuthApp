const User = require("../models/user.model");

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
      order: [["id", "ASC"]]
    });

    return res.json({ users });
  } catch (error) {
    console.error("Loading users failed:", error);
    return res.status(500).json({ message: "Unable to load users." });
  }
}

module.exports = { getUsers };
