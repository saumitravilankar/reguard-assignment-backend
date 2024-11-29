import express from "express";
import dotenv from "dotenv";
import customerRouter from "./routes/customerRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 8001;

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use("/customers", customerRouter);
app.use("/dashboard", dashboardRouter);
app.use("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
