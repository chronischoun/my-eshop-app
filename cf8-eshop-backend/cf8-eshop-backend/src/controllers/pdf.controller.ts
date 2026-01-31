import { Request, Response } from "express";
import { PdfModel } from "../models/pdf.model";
import Product from "../models/products";
import path from "path";
import fs from "fs";


export const uploadPdfController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    
    const pdf = await PdfModel.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      isFree: true,
    });

   
    const product = await Product.create({
      title: req.body.title ?? pdf.originalName,
      author: req.body.author ?? "Unknown",
      description: req.body.description ?? "PDF Book",
      price: req.body.price ?? 0,
      stock: 9999,
      category: "book",
      pdfUuid: pdf.uuid,
      image: req.body.image ?? "",
    });

    return res.status(201).json({
      message: "PDF uploaded and product created",
      pdf,
      product,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Server error during upload" });
  }
};

export const downloadPdfController = async (req: Request, res: Response) => {
  try {
    
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }

   
    const pdf = await PdfModel.findOne({ uuid: uuid as string });

    if (!pdf) {
      return res.status(404).json({ message: "File record not found in database" });
    }

    const filePath = path.resolve(pdf.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    return res.download(filePath, pdf.originalName);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewPdfController = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }

    const pdf = await PdfModel.findOne({ uuid: uuid as string });

    if (!pdf) {
      return res.status(404).json({ message: "File record not found in a database" });
    }

    const filePath = path.resolve(pdf.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    return res.sendFile(filePath);
  } catch (error) {
    console.error("View PDF error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};