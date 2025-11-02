import { Request, Response } from "express";
import * as documentQuery from "../../database/query/document";
import * as tagQuery from "../../database/query/tag";
import * as documentTagQuery from "../../database/query/documentTag";
import { AddDocumentRequest } from "./types";

export const addDocumentController = async (req: Request<{}, {}, AddDocumentRequest>, res: Response) => {
    try {
        const file = req.file as Express.Multer.File;
        const ownerId = req.auth.user._id;

        // Validate file exists
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Create the document
        const document = await documentQuery.addDocument({
            ownerId: ownerId,
            filename: file.originalname,
            mime: file.mimetype,
            textContent: file.buffer.toString("utf-8"),
        });

        // Find or create primary tag
        const primaryTag = await tagQuery.findOrCreateTag(
            req.body.primaryTag,
            ownerId
        );

        // Create primary tag relationship
        await documentTagQuery.createDocumentTag({
            documentId: document._id,
            tagId: primaryTag._id,
            isPrimary: true,
        });

        // Find or create secondary tags and attach them
        const secondaryTagPromises = req.body.secondaryTags.map(async (tagName) => {
            const tag = await tagQuery.findOrCreateTag(tagName, ownerId);
            return documentTagQuery.createDocumentTag({
                documentId: document._id,
                tagId: tag._id,
                isPrimary: false,
            });
        });

        await Promise.all(secondaryTagPromises);

        res.status(201).json({ 
            message: "Document added successfully",
            documentId: document._id,
        });
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};