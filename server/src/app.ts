import express from "express";
import cookieParser from "cookie-parser";
import linkRouter from "./routes/linkRoutes.js";
import userRouter from "./routes/userRoutes.js";
import codeRouter from "./routes/codeRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/links", linkRouter);
app.use("/users", userRouter);
app.use("/codes", codeRouter);

export default app;