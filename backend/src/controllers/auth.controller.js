const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError, ValidationError } = require("sequelize");
const User = require("../models/user.model");

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail) {
    return res.status(400).json({ message: "Name and email cannot be empty." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must contain at least 6 characters." });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user)
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    console.error("Register failed:", error);
    return res.status(500).json({ message: "Unable to create the account." });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful.",
      user: publicUser(user),
      token
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
}

module.exports = { register, login };
