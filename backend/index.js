import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./utils/db.js";
import router from "./routes/user.route.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm coming from backend",
    success: true,
  });
});

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/user", router);
app.get("/health", (req, res) => {
  res.status(200).send('OK');
})

app.listen(PORT, () => {
  connectDb();
  console.log(`Server started at PORT: ${PORT}`);
});
