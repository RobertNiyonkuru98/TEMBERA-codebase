import { Router } from "express";
import { UploadController, upload, uploadVideo } from "../controllers/UploadController";
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

// Upload multiple videos (protected route)
router.post(
  "/videos",
  authenticateToken,
  uploadVideo.array("videos", 5), // Allow up to 5 videos
  uploadController.uploadVideos.bind(uploadController)
);

// Delete a video (protected route)
router.delete(
  "/videos",
  authenticateToken,
  uploadController.deleteVideo.bind(uploadController)
);

export default router;
