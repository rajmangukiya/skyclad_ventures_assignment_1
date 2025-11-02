import express from "express";
import userRouter from "./user/router";
import documentRouter from "./document/router";

const router = express.Router();

router.use("/user", userRouter);
router.use("/document", documentRouter);

export default router;      