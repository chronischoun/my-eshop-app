import { Request, Response } from "express";
import Order from "../models/orders";
import { isValidObjectId } from "mongoose";
import { Types } from "mongoose";
// CREATE order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { user, items, total } = req.body;
    const order = await Order.create({ user, items, total });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// GET all orders (admin)
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "email name")
      .populate("items.products");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// GET orders by user
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const orders = await Order.find({
      user: new Types.ObjectId(userId)
    }).populate("items.products");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error });
  }
};

// GET single order by id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findById(id)
      .populate("user", "email name")
      .populate("items.products");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// DELETE order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};
