const express = require("express");
const { getUsers } = require("../controllers/user.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/users", authenticateToken, getUsers);

module.exports = router;
