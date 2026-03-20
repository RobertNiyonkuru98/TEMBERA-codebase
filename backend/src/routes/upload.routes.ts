import { Router } from "express";
import { UploadController, upload } from "../controllers/UploadController";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const uploadController = new UploadController();

// Upload multiple images (protected route)
router.post(
  "/images",
  authenticateToken,
  upload.array("images", 10), // Allow up to 10 images
  uploadController.uploadImages.bind(uploadController)
);

// Delete an image (protected route)
router.delete(
  "/images",
  authenticateToken,
  uploadController.deleteImage.bind(uploadController)
);

export default router;
