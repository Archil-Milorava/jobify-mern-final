import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import jobRouter from "./routes/jobRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticatedUser } from "./middleware/authMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import cloudinary from "cloudinary";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

/////////////////////////////
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", authenticatedUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "route not found",
  });
});

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
  });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}
