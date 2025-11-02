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
export const findTagByName = async (name: string, ownerId?: string): Promise<ITag | null> => {
  try {
    const normalizedName = name.trim().toLowerCase();
    return await Tag.findOne({ 
      name: normalizedName, 
      ownerId: ownerId ?? { $exists: true }
    });
  } catch (error) {
    throw error;
  }
};

export const findTagsByNames = async (names: string[], ownerId: string): Promise<ITag[]> => {
  try {
    const normalizedNames = names.map(name => name.trim().toLowerCase());
    return await Tag.find({ name: { $in: normalizedNames }, ownerId });
  } catch (error) {
    throw error;
  }
};

// Search tags (folders) by name
export const searchTags = async (
  ownerId?: string,
  searchQuery?: string,
  tagIds?: string[]
): Promise<ITag[]> => {
  try {
    const query: any = {};

    if (ownerId) {
      query.ownerId = ownerId;
    }

    // Filter by tag IDs if provided
    if (tagIds && tagIds.length > 0) {
      query._id = { $in: tagIds };
    }

    // Full-text search using regex on tag name
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i"); // Case-insensitive
      query.name = { $regex: searchRegex };
    }

    return await Tag.find(query).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};