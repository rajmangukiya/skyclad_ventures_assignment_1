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