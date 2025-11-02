import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
  _id: string;
  ownerId: string;
  filename: string;
  mime: string;
  textContent: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    ownerId: {
      type: String,
      required: [true, "Owner ID is required"],
      trim: true,
      ref: "User",
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    mime: {
      type: String,
      required: [true, "MIME type is required"],
      trim: true,
    },
    textContent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocument>("Document", DocumentSchema);

