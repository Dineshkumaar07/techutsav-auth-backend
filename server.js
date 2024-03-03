const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/auth");
const profileRoutes = require("./routes/profileRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/auth", authRoutes);
app.use("/profile", requireAuth, profileRoutes);
app.use("/event", eventRoutes);

try {
  mongoose.connect(process.env.DB_URL).then((result) => {
    console.log("DB CONNCECTION SUCCESSFUL");
    app.listen(process.env.PORT, () => {
      console.log("Server Started on PORT: " + process.env.PORT);
    });
  });
} catch (err) {
  console.log(err);
}
