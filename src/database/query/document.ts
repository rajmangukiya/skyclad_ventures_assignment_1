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