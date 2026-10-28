import { Schema, model, models, type Model } from "mongoose";

const PENDING_TTL_SECONDS = 24 * 60 * 60;

// Images uploaded from the admin. An upload starts as `pending` and becomes
// permanent once an entry that uses it is saved; pending uploads nobody saved
// are removed by MongoDB's TTL monitor after a day.
const storedImageSchema = new Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    pending: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "images" }
);

storedImageSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: PENDING_TTL_SECONDS,
    partialFilterExpression: { pending: true },
  }
);

interface StoredImageDoc {
  data: Buffer;
  contentType: string;
  size: number;
  pending: boolean;
  createdAt: Date;
}

export const StoredImage =
  (models.StoredImage as Model<StoredImageDoc>) ||
  model<StoredImageDoc>("StoredImage", storedImageSchema);
