import fs from "fs/promises";
import path from "path";
import { PdfModel } from "../models/pdf.model";
import Product from "../models/products";

const uploadsDir = path.join(process.cwd(), "uploads", "pdfs");

/**
 * Synchronizes the database with the contents of the uploads directory.
 * It removes any database records for PDFs and Products that no longer
 * have a corresponding file in the uploads directory.
 */
export const syncUploadsWithDB = async () => {
  console.log("🔄 Starting synchronization of uploads with database...");

  try {
    // Ensure the uploads directory exists before trying to read it
    await fs.mkdir(uploadsDir, { recursive: true });

    // 1. Get all filenames from the uploads directory
    const filesOnDisk = new Set(await fs.readdir(uploadsDir));
    console.log(`🔍 Found ${filesOnDisk.size} files in uploads directory.`);

    // 2. Get all PDF records from the database
    const pdfsInDB = await PdfModel.find().lean();
    console.log(`📄 Found ${pdfsInDB.length} PDF records in the database.`);

    // 3. Find orphaned database records
    const orphanedPdfs = pdfsInDB.filter(pdf => !filesOnDisk.has(pdf.filename));

    if (orphanedPdfs.length === 0) {
      console.log("✅ Database is already in sync. No cleanup needed.");
      return;
    }

    console.log(`🗑️ Found ${orphanedPdfs.length} orphaned database records. Starting cleanup...`);

    const orphanedPdfUuids = orphanedPdfs.map(pdf => pdf.uuid);
    const orphanedPdfIds = orphanedPdfs.map(pdf => pdf._id);

    // 4. Delete orphaned products associated with the orphaned PDFs
    const productDeletionResult = await Product.deleteMany({ pdfUuid: { $in: orphanedPdfUuids } });
    if (productDeletionResult.deletedCount > 0) {
      console.log(`- Deleted ${productDeletionResult.deletedCount} orphaned products.`);
    }

    // 5. Delete orphaned PDF records
    const pdfDeletionResult = await PdfModel.deleteMany({ _id: { $in: orphanedPdfIds } });
    if (pdfDeletionResult.deletedCount > 0) {
      console.log(`- Deleted ${pdfDeletionResult.deletedCount} orphaned PDF records.`);
    }

    console.log("✅ Synchronization complete.");

  } catch (error) {
    console.error("❌ Error during database synchronization:", error);
  }
};
