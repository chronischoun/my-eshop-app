import { Request, Response } from "express";
import { Types } from "mongoose";
import Cart from "../models/cart";

// Get cart by user
export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: new Types.ObjectId(userId) }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Create new cart
export const createCart = async (req: Request, res: Response) => {
  try {
    const { user, items } = req.body;
    const cart = new Cart({ user: new Types.ObjectId(user), items });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Add item to cart
export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { product, quantity } = req.body;

    let cart = await Cart.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) cart = new Cart({ user: new Types.ObjectId(userId), items: [] });

    const existingItem = cart.items.find(item => item.product.equals(product));
    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ product: new Types.ObjectId(product), quantity });

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i._id?.toString() === itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;
    const cart = await Cart.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ user: new Types.ObjectId(userId) });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
