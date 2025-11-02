import express from "express";
import { searchController } from "./controller";
import { validateRequest } from "../../middlewares/validator";
import { SearchRequest } from "./types";
import { UserRole } from "../../database/types";
import authCheckMiddleware from "../../middlewares/auth";

const router = express.Router();

// Search for documents in folders or files
router.get(
  "/",
  authCheckMiddleware([UserRole.admin, UserRole.user, UserRole.support, UserRole.moderator]),
  validateRequest({ query: SearchRequest }),
  searchController
);

export default router;

