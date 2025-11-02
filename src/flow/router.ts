import express from "express";
import userRouter from "./user/router";
import documentRouter from "./document/router";
import tagsRouter from "./tag/router";
import searchRouter from "./search/router";

const router = express.Router();

router.use("/user", userRouter);
router.use("/document", documentRouter);
router.use("/folders", tagsRouter);
router.use("/search", searchRouter);

export default router;      