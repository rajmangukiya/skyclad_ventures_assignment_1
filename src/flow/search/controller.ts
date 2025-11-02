import { Request, Response } from "express";
import * as documentQuery from "../../database/query/document";
import * as tagQuery from "../../database/query/tag";
import * as documentTagQuery from "../../database/query/documentTag";
import { UserRole } from "../../database/types";

export const searchController = async (req: Request, res: Response) => {
  try {
    
    if (!req.auth || !req.auth.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const authUser = req.auth.user;
    let ownerId: string | undefined;
    if (authUser.role == UserRole.user) {
      ownerId = authUser._id
    }

    const searchQuery = req.query.q as string | undefined;
    const scope = req.query.scope as "folder" | "files" | undefined;
    const idsParam = req.query.ids;

    // Normalize ids parameter - can be string, array, or undefined
    let ids: string[] | undefined;
    if (idsParam) {
      if (Array.isArray(idsParam)) {
        ids = idsParam.map((id) => String(id));
      } else {
        ids = [String(idsParam)];
      }
    }

    // Validation is handled by zod schema, but keeping for safety

    const results: {
      folders?: Array<{
        id: string;
        name: string;
        createdAt: Date;
      }>;
      files?: Array<{
        id: string;
        filename: string;
        mime: string;
        textContent: string;
        createdAt: Date;
        updatedAt: Date;
      }>;
    } = {};

    // Search in folders (primary tags) if scope is "folder" or not specified
    if (!scope || scope === "folder") {
      const tags = await tagQuery.searchTags(ownerId, searchQuery, ids);
      
      // Filter to only primary tags by checking documentTag relationships
      const primaryTagIds = await documentTagQuery.getPrimaryTagsWithDocumentCounts(ownerId);
      const primaryTagIdSet = new Set(primaryTagIds.map(item => item.tagId));
      
      const primaryTags = tags.filter(tag => primaryTagIdSet.has(tag._id.toString()));

      results.folders = primaryTags.map((tag) => ({
        id: tag._id.toString(),
        name: tag.name,
        createdAt: tag.createdAt,
      }));
    }

    // Search in files (documents) if scope is "files" or not specified
    if (!scope || scope === "files") {
      const documents = await documentQuery.searchDocuments(
        ownerId,
        searchQuery,
        ids
      );

      results.files = documents.map((doc) => ({
        id: doc._id.toString(),
        filename: doc.filename,
        mime: doc.mime,
        textContent: doc.textContent,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
    }

    res.status(200).json({
      ...results,
      total:
        (results.folders?.length || 0) + (results.files?.length || 0),
    });
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

