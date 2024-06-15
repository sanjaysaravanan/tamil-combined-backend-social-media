import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import mongooseConnect from "./db-utils/mongoose-connection.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

const authAllApi = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.log(err.message);
    // err
    res.status(403).send({ msg: "Unauthorized" });
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authAllApi, usersRouter);
app.use("/api/posts", postsRouter);

// Connect to MongoDB
await mongooseConnect();

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
