import { Request, Response } from "express";
import * as documentQuery from "../../database/query/document";
import * as tagQuery from "../../database/query/tag";
import * as documentTagQuery from "../../database/query/documentTag";
import { AddDocumentRequest } from "./types";
import { IDocument } from "../../database/models/Document";

export const addDocument = {
    controller: async (req: Request<{}, {}, AddDocumentRequest>, res: Response) => {
        try {

            const ownerId = req.auth.user._id;
            if (!ownerId) {
                throw new Error("Owner ID is required");
            }
            const file = req.file as Express.Multer.File;
            if (!file) {
                throw new Error("No file uploaded");
            }

            const document = await addDocument.addDocument({file: file, ownerId: ownerId});
            await addDocument.addPrimaryTag(document._id, req.body.primaryTag, ownerId);
            await addDocument.addSecondaryTags(document._id, req.body.secondaryTags, ownerId);
    
            res.status(201).json({ 
                message: "Document added successfully",
                documentId: document._id,
            });
        } catch (error) {
            console.error("Error adding document:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    addDocument: async ({file, ownerId}: {file: Express.Multer.File, ownerId: string}): Promise<IDocument> => {
        try {
            const filename = file.originalname;
            const mime = file.mimetype;
            const textContent = file.buffer.toString("utf-8");
            
            const document = await documentQuery.addDocument({
                ownerId: ownerId,
                filename: filename,
                mime: mime,
                textContent: textContent,
            });

            return document;
        } catch (error) {
            console.error("Error adding document:", error);
            throw error;
        }
    },
    addPrimaryTag: async (documentId: string, primaryTagName: string, ownerId: string) => {
        try {

            // Find or create primary tag
            const primaryTag = await tagQuery.findOrCreateTag(
                primaryTagName,
                ownerId
            );
    
            // Create primary tag relationship
            await documentTagQuery.createDocumentTag({
                documentId: documentId,
                tagId: primaryTag._id,
                isPrimary: true,
            });
            
        } catch (error) {
            console.error("Error putting primary tag:", error);
            throw error;
        }
    },
    addSecondaryTags: async (documentId: string, secondaryTagNames: string[], ownerId: string): Promise<void> => {
        try {
            // Find or create secondary tags and attach them
            // First, get all existing tags for the provided secondary tag names and ownerId
            const normalizedSecondaryTags = secondaryTagNames.map(t => t.trim().toLowerCase());
            const existingTags = await tagQuery.findTagsByNames(normalizedSecondaryTags, ownerId);
    
            // Create a lookup for quick access
            const existingTagsMap = new Map(existingTags.map(tag => [tag.name, tag]));
    
            // Determine which tags still need to be created (not found in existingTags)
            const tagsToCreate = normalizedSecondaryTags.filter(tagName => !existingTagsMap.has(tagName));
            
            // Create the new tags
            const createdTags = await Promise.all(
                tagsToCreate.map(tagName => tagQuery.findOrCreateTag(tagName, ownerId))
            );
    
            // Combine all secondary tag objects
            const allTags = [
                ...existingTags,
                ...createdTags
            ];
    
            // Attach all as secondary tags to document
            const secondaryTagPromises = allTags.map(tag =>
                documentTagQuery.createDocumentTag({
                    documentId: documentId,
                    tagId: tag._id,
                    isPrimary: false,
                })
            );
    
            await Promise.all(secondaryTagPromises);
        } catch (error) {
            console.error("Error putting secondary tags:", error);
            throw error;
        }
    }
}