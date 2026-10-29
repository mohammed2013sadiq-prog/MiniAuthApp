require("dotenv").config();

const cors = require("cors");
const express = require("express");
const sequelize = require("./db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MiniAuth API is running." });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, "0.0.0.0", () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Could not start the API. Check the PostgreSQL settings:", error);
    process.exit(1);
  }
}

startServer();
