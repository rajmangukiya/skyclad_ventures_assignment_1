import express from "express";
import { addDocumentController } from "./controller";
import { validateRequest } from "../../middlewares/validator";
import { AddDocumentRequest } from "./types";
import { UserRole } from "../../database/types";
import authCheckMiddleware from "../../middlewares/auth";
import { upload } from "../../utils/multer";

const router = express.Router();

router.post(
    "/", 
    upload.single("document"),
    authCheckMiddleware(UserRole.user), 
    validateRequest({ body: AddDocumentRequest }), 
    addDocumentController
);

export default router;      