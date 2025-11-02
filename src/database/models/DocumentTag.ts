import mongoose, { Schema, Document } from "mongoose";

export interface IDocumentTag extends Document {
  _id: string;
  documentId: string;
  tagId: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentTagSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    documentId: {
      type: String,
      required: [true, "Document ID is required"],
      trim: true,
    },
    tagId: {
      type: String,
      required: [true, "Tag ID is required"],
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate document-tag relationships
DocumentTagSchema.index({ documentId: 1, tagId: 1 }, { unique: true });

export default mongoose.model<IDocumentTag>("DocumentTag", DocumentTagSchema);

