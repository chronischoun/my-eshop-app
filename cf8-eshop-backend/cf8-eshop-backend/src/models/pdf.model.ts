import { Schema, model, InferSchemaType } from "mongoose";
import { v4 as uuidv4 } from "uuid";


const pdfSchema = new Schema(
  {
    uuid: {
      type: String,
      default: () => uuidv4(), 
      unique: true,
      index: true,
    },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    isFree: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export type IPdf = InferSchemaType<typeof pdfSchema>;

export const PdfModel = model<IPdf>("Pdf", pdfSchema);