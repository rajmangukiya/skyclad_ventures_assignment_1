import express from "express";
import { getPrimaryTagsController } from "./controller";
import { UserRole } from "../../database/types";
import { validateRequest } from "../../middlewares/validator";
import { GetDocumentsByPrimaryTagRequest } from "./types";
import { getDocumentsByPrimaryTagController } from "./controller";
import authCheckMiddleware from "../../middlewares/auth";

const router = express.Router();

// Get all folders
router.get(
    "/",
    authCheckMiddleware([UserRole.admin, UserRole.user, UserRole.support, UserRole.moderator]),
    getPrimaryTagsController
);

// Get all documents by folder
router.get(
    "/:primaryTag/docs",
    authCheckMiddleware([UserRole.admin, UserRole.user, UserRole.support, UserRole.moderator]),
    validateRequest({ params: GetDocumentsByPrimaryTagRequest }),
    getDocumentsByPrimaryTagController
);

export default router;

