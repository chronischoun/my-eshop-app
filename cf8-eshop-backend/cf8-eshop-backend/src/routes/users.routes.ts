import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.middlewares";
import { 
  getMyProfile, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  createUser,
  savePdfToLibrary // Πρόσθεσε την εισαγωγή εδώ
} from "../controllers/user.controllers";

const router = Router();

// --- Routes για απλούς συνδεδεμένους χρήστες ---

// 1. Λήψη προφίλ
router.get("/profile", protect, getMyProfile);

// 2. Αποθήκευση PDF στη βιβλιοθήκη (ΑΥΤΟ ΕΛΕΙΠΕ)
// Αυτό το URL καλεί το Angular: /api/users/save-pdf
router.post("/save-pdf", protect, savePdfToLibrary);


// --- Routes Διαχείρισης από Admin ---

router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;