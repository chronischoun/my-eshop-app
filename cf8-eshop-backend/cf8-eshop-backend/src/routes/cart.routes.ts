import { Router } from "express";
import { 
  getCartByUser, 
  createCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from "../controllers/cart.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get cart by user ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User cart
 *       404:
 *         description: Cart not found
 */
router.get("/:userId", getCartByUser);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a new cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64a7c1f9e4b0a1
 *     responses:
 *       201:
 *         description: Cart created successfully
 */
router.post("/", createCart);

/**
 * @swagger
 * /cart/{userId}/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *       404:
 *         description: Cart or product not found
 */
router.post("/:userId/items", addItemToCart);

/**
 * @swagger
 * /cart/{userId}/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Item not found
 */
router.put("/:userId/items/:itemId", updateCartItem);

/**
 * @swagger
 * /cart/{userId}/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found
 */
router.delete("/:userId/items/:itemId", removeCartItem);

/**
 * @swagger
 * /cart/{userId}:
 *   delete:
 *     summary: Clear user cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
router.delete("/:userId", clearCart);

export default router;
