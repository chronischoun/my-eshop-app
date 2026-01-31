import { Router } from "express";
import { uploadPdfMiddleware } from "../middlewares/uploadPdf.middleware";
import {
  uploadPdfController,
  downloadPdfController,
  viewPdfController,
} from "../controllers/pdf.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: PDF management and download
 */

/**
 * @swagger
 * /api/pdf/upload:
 *   post:
 *     summary: Upload a new PDF
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: PDF uploaded successfully
 */
router.post(
  "/upload",
  uploadPdfMiddleware.single("file"),
  uploadPdfController
);

/**
 * @swagger
 * /api/pdf/download/{uuid}:
 *   get:
 *     summary: Download a PDF file via UUID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the PDF
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 */
router.get("/download/:uuid", downloadPdfController);

/**
 * @swagger
 * /api/pdf/view/{uuid}:
 *   get:
 *     summary: Stream/View a PDF file by UUID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the PDF
 *     responses:
 *       200:
 *         description: PDF streamed successfully
 *       404:
 *         description: File not found
 */
router.get("/view/:uuid", viewPdfController);

export default router;
