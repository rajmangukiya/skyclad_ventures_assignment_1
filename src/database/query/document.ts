import Document,{ IDocument } from "../models/Document";

export const addDocument = async (documentData: {
  ownerId: string;
  filename: string;
  mime: string;
  textContent: string;
}): Promise<IDocument> => {
  try {
    const document = new Document(documentData);
    return await document.save();
  } catch (error) {
    throw error;
  }
};

// Get documents by document IDs
export const getDocumentsByIds = async (documentIds: string[]): Promise<IDocument[]> => {
  try {
    if (documentIds.length === 0) {
      return [];
    }
    return await Document.find({ _id: { $in: documentIds } }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Get documents by owner ID
export const getDocumentsByOwnerId = async (ownerId: string): Promise<IDocument[]> => {
  try {
    return await Document.find({ ownerId }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Full-text search in documents
export const searchDocuments = async (
  ownerId?: string,
  searchQuery?: string,
  documentIds?: string[]
): Promise<IDocument[]> => {
  try {
    const query: any = {};

    if (ownerId) {
      query.ownerId = ownerId;
    }

    // Filter by document IDs if provided
    if (documentIds && documentIds.length > 0) {
      query._id = { $in: documentIds };
    }

    // Full-text search using regex on textContent and filename
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i"); // Case-insensitive
      query.$or = [
        { textContent: { $regex: searchRegex } },
        { filename: { $regex: searchRegex } },
      ];
    }

    return await Document.find(query).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};