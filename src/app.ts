import express from "express";
import { startServer } from "./server";
import './env';
import router from "./flow/router";
import { errorHandler } from "./middlewares/error";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

app.use(errorHandler);

startServer(app);

