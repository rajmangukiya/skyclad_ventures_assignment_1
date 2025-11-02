import DocumentTag, { IDocumentTag } from "../models/DocumentTag";
import Tag from "../models/Tag";

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

export const getPrimaryTagsWithDocumentCounts = async (ownerId: string): Promise<Array<{ tagId: string; documentCount: number }>> => {
  try {
    const userTags = await Tag.find({ ownerId });
    const userTagIds = userTags.map(tag => tag._id);

    if (userTagIds.length === 0) {
      return [];
    }

    const userTagIdStrings = userTagIds.map(id => id.toString());
    const aggregationResult = await DocumentTag.aggregate([
      {
        $match: {
          isPrimary: true,
          tagId: { $in: userTagIdStrings }
        }
      },
      {
        $group: {
          _id: "$tagId",
          documentCount: { $sum: 1 }
        }
      }
    ]);

    // Transform to the desired format
    return aggregationResult.map(result => ({
      tagId: result._id,
      documentCount: result.documentCount
    }));
  } catch (error) {
    throw error;
  }
};
// Get document IDs by primary tag ID
export const getDocumentIdsByPrimaryTagId = async (tagId: string): Promise<string[]> => {
  try {
    const documentTags = await DocumentTag.find({
      tagId: tagId,
      isPrimary: true,
    });

    return documentTags.map(dt => dt.documentId);
  } catch (error) {
    throw error;
  }
};

