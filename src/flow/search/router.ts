import express from "express";
import { searchController } from "./controller";
import { validateRequest } from "../../middlewares/validator";
import { SearchRequest } from "./types";
import { UserRole } from "../../database/types";
import authCheckMiddleware from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  authCheckMiddleware(UserRole.user),
  validateRequest({ query: SearchRequest }),
  searchController
);

export default router;

