import { Router } from "express";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/books", authenticate, authorize(1 << 1), addBook);

router.get("/books", getBooks);

router.get("/books/:id", getBookById);

router.put("/books/:id", authenticate, authorize(1 << 1), updateBook);

router.delete("/books/:id", authenticate, authorize(1 << 1), deleteBook);

export default router;
