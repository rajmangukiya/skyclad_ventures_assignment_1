import Tag, { ITag } from "../models/Tag";

/**
 * Find or create a tag by name and ownerId
 */
export const findOrCreateTag = async (name: string, ownerId: string): Promise<ITag> => {
  try {
    // Normalize tag name (lowercase, trim)
    const normalizedName = name.trim().toLowerCase();
    
    // Try to find existing tag
    let tag = await Tag.findOne({ 
      name: normalizedName, 
      ownerId 
    });

    // If tag doesn't exist, create it
    if (!tag) {
      tag = new Tag({
        name: normalizedName,
        ownerId,
      });
      await tag.save();
    }

    return tag;
  } catch (error) {
    throw error;
  }
};

/**
 * Find tag by ID
 */
export const findTagById = async (tagId: string): Promise<ITag | null> => {
  try {
    return await Tag.findById(tagId);
  } catch (error) {
    throw error;
  }
};

/**
 * Find tag by name and ownerId
 */
export const findTagByName = async (name: string, ownerId: string): Promise<ITag | null> => {
  try {
    const normalizedName = name.trim().toLowerCase();
    return await Tag.findOne({ 
      name: normalizedName, 
      ownerId 
    });
  } catch (error) {
    throw error;
  }
};

