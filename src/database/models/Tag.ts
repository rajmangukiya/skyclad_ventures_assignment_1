import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  _id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
    },
    ownerId: {
      type: String,
      required: [true, "Owner ID is required"],
      trim: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITag>("Tag", TagSchema);

