import express from "express";
import { getPrimaryTagsController } from "./controller";
import { UserRole } from "../../database/types";
import authCheckMiddleware from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validator";
import { GetDocumentsByPrimaryTagRequest } from "./types";
import { getDocumentsByPrimaryTagController } from "./controller";

const router = express.Router();

router.get(
    "/",
    authCheckMiddleware(UserRole.user),
    getPrimaryTagsController
);

router.get(
    "/:primaryTag/docs",
    authCheckMiddleware(UserRole.user),
    validateRequest({ params: GetDocumentsByPrimaryTagRequest }),
    getDocumentsByPrimaryTagController
);

export default router;

