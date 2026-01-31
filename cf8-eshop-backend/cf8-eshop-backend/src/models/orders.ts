
import { Schema, model, Document, Types } from "mongoose";
import products from "./products";

interface OrdersItem {
  products: Types.ObjectId | any ;
  title: string;
  author: string;
  quantity: number;
  price: number;
}

export interface IOrders extends Document {
  user: Types.ObjectId;
  items: OrdersItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
}

const OrderSchema = new Schema<IOrders>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      products: { type: Schema.Types.ObjectId, ref: "Product" },
      title: String,
      author: String,
      quantity: Number,
      price: Number
    }
  ],

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default model<IOrders>("Order", OrderSchema);
