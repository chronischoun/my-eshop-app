import { Request, Response } from "express";
import { User } from "../models/users";
import { PdfModel } from "../models/pdf.model"; // Απαραίτητο import για την αναζήτηση
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Types } from "mongoose";

/**
 * CREATE user (Admin)
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    const safeUser = await User.findById(user._id).select("-password");
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};

/**
 * GET my profile
 */
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("downloadedBooks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const savePdfToLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const { pdfId } = req.body; // Εδώ λαμβάνουμε το UUID (π.χ. feaded5d-...)

    const pdfRecord = await PdfModel.findOne({ uuid: pdfId });

    if (!pdfRecord) {
      console.error(`PDF with UUID ${pdfId} not found in database.`);
      return res.status(404).json({ message: "PDF record not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { downloadedBooks: pdfRecord._id } }, 
      { new: true } 
    )
    .select("-password")
    .populate("downloadedBooks"); 

    console.log("User library updated successfully with PDF:", pdfRecord.originalName);
    res.json(updatedUser); 
  } catch (error) {
    console.error("Save PDF Error:", error);
    res.status(500).json({ message: "Failed to save PDF due to server error", error });
  }
};

/**
 * GET all users (Admin)
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * GET user by ID (self or admin)
 */
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * UPDATE user (self or admin)
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * DELETE user (Admin)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};