
import { Schema, model, Document, Types } from "mongoose";

interface CartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;

}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: CartItem[];
}

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

export default model<ICart>("Cart", CartSchema);


