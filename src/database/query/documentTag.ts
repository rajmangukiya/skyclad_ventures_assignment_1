import DocumentTag, { IDocumentTag } from "../models/DocumentTag";

export const createDocumentTag = async (documentTagData: {
  documentId: string;
  tagId: string;
  isPrimary: boolean;
}): Promise<IDocumentTag> => {
  try {
    const documentTag = new DocumentTag(documentTagData);
    return await documentTag.save();
  } catch (error) {
    throw error;
  }
};

export const findDocumentTagsByDocumentId = async (documentId: string): Promise<IDocumentTag[]> => {
  try {
    return await DocumentTag.find({ documentId });
  } catch (error) {
    throw error;
  }
};

export const findDocumentTagsByTagId = async (tagId: string): Promise<IDocumentTag[]> => {
  try {
    return await DocumentTag.find({ tagId });
  } catch (error) {
    throw error;
  }
};

export const deleteDocumentTag = async (documentId: string, tagId: string): Promise<IDocumentTag | null> => {
  try {
    return await DocumentTag.findOneAndDelete({ documentId, tagId });
  } catch (error) {
    throw error;
  }
};

