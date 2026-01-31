import { Schema, model, Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";

export interface Iusers extends Document { 
  name?: string; 
  email: string; 
  password: string; 
  role: "user" | "admin"; 
  downloadedBooks: Schema.Types.ObjectId[]; 
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<Iusers>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  downloadedBooks: [{ type: Schema.Types.ObjectId, ref: "Pdf" }] 
}, { timestamps: true }); 

UserSchema.pre<Iusers>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = model<Iusers>("User", UserSchema);