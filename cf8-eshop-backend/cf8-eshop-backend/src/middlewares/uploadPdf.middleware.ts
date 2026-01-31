import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdfs");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const uploadPdfMiddleware = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      path.extname(file.originalname).toLowerCase() === ".pdf";

    if (!isPdf) {
      cb(new Error("Only PDF files are allowed"));
    } else {
      cb(null, true);
    }
  },
});
