import { Request, Response } from "express";
import * as documentTagQuery from "../../database/query/documentTag";
import Tag from "../../database/models/Tag";
import * as tagQuery from "../../database/query/tag";
import * as documentQuery from "../../database/query/document";
import { UserRole } from "../../database/types";

export const getPrimaryTagsController = async (req: Request, res: Response) => {
    try {
        if (!req.auth || !req.auth.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const authUser = req.auth.user;

        // Get primary tags with document counts
        let primaryTagsWithCounts: { tagId: string; documentCount: number }[] = [];
        if (authUser.role == UserRole.user) {
            primaryTagsWithCounts = await documentTagQuery.getPrimaryTagsWithDocumentCounts(authUser._id);
        } else {
            primaryTagsWithCounts = await documentTagQuery.getPrimaryTagsWithDocumentCounts();
        }

        // If no primary tags found, return empty array
        if (primaryTagsWithCounts.length === 0) {
            return res.status(200).json({
                folders: [],
                total: 0,
            });
        }

        // Get all tag IDs
        const tagIds = primaryTagsWithCounts.map(item => item.tagId);

        // Fetch all tags in a single query
        const tags = await Tag.find({ _id: { $in: tagIds } });

        // Create a map for quick lookup of document counts
        const countMap = new Map(primaryTagsWithCounts.map(item => [item.tagId, item.documentCount]));

        // Build folders array
        const folders = tags.map(tag => ({
            id: tag._id,
            name: tag.name,
            documentCount: countMap.get(tag._id.toString()) || 0,
            createdAt: tag.createdAt,
        }));

        res.status(200).json({
            folders: folders,
            total: folders.length,
        });
    } catch (error) {
        console.error("Error getting folders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDocumentsByPrimaryTagController = async (req: Request, res: Response) => {
    try {
        if (!req.auth || !req.auth.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in controller" });
        }
        const authUser = req.auth.user;
        let ownerId: string | undefined;
        if (authUser.role == UserRole.user) {
            ownerId = authUser._id;
        }
        const tagName = req.params.primaryTag as string;

        if (!tagName) {
            return res.status(400).json({ message: "Tag name is required" });
        }

        // Find the tag by name and owner
        const tag = await tagQuery.findTagByName(tagName, ownerId);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        // Verify the tag belongs to the user
        if (ownerId && tag.ownerId != ownerId) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Get all document IDs where this tag is the primary tag
        const documentIds = await documentTagQuery.getDocumentIdsByPrimaryTagId(tag._id.toString());

        if (documentIds.length === 0) {
            return res.status(200).json({
                documents: [],
                total: 0,
            });
        }

        // Get all documents
        const documents = await documentQuery.getDocumentsByIds(documentIds);

        // Format response
        const formattedDocuments = documents.map(doc => ({
            id: doc._id,
            filename: doc.filename,
            mime: doc.mime,
            textContent: doc.textContent,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }));

        res.status(200).json({
            documents: formattedDocuments,
            total: formattedDocuments.length,
        });
    } catch (error) {
        console.error("Error getting documents by primary tag:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};