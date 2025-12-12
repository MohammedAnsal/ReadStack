import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: unknown;
  category: string;
  featuredImage?: string | null;
  featuredImageId?: string | null;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  isBlocked: boolean;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    category: { type: String, required: true },

    featuredImage: { type: String, default: null },
    featuredImageId: { type: String, default: null },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>("Article", articleSchema);
