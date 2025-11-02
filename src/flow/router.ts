import express from "express";
import userRouter from "./user/router";
import documentRouter from "./document/router";
import tagsRouter from "./tag/router";

const router = express.Router();

router.use("/user", userRouter);
router.use("/document", documentRouter);
router.use("/folders", tagsRouter);

export default router;      