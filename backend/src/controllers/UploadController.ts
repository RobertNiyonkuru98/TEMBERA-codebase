import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Multer config for images
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Multer config for videos
export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (_req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadController {
  /**
   * Upload single or multiple images to Cloudinary
   */
  async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      // Upload all files to Cloudinary
      const uploadPromises = files.map((file) => {
        return new Promise<{ url: string; publicId: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "tembera/itineraries",
                resource_type: "image",
                transformation: [
                  { width: 1200, height: 800, crop: "limit" },
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else if (result) {
                  resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                  });
                } else {
                  reject(new Error("Upload failed"));
                }
              }
            );

            // Convert buffer to stream and pipe to Cloudinary
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
          }
        );
      });

      const uploadedImages = await Promise.all(uploadPromises);

      res.status(200).json({
        message: "Images uploaded successfully",
        images: uploadedImages,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to upload images",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Upload single or multiple videos to Cloudinary
   */
  async uploadVideos(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      // Upload all files to Cloudinary
      const uploadPromises = files.map((file) => {
        return new Promise<{ url: string; publicId: string; thumbnailUrl?: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "tembera/videos",
                resource_type: "video",
                transformation: [
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else if (result) {
                  resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    // Cloudinary auto-generates thumbnail for videos
                    thumbnailUrl: result.secure_url.replace(/\.[^.]+$/, '.jpg'),
                  });
                } else {
                  reject(new Error("Upload failed"));
                }
              }
            );

            // Convert buffer to stream and pipe to Cloudinary
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
          }
        );
      });

      const uploadedVideos = await Promise.all(uploadPromises);

      res.status(200).json({
        message: "Videos uploaded successfully",
        videos: uploadedVideos,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to upload videos",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        res.status(400).json({ error: "Public ID is required" });
        return;
      }

      await cloudinary.uploader.destroy(publicId);

      res.status(200).json({
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({
        error: "Failed to delete image",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete a video from Cloudinary
   */
  async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        res.status(400).json({ error: "Public ID is required" });
        return;
      }

      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

      res.status(200).json({
        message: "Video deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({
        error: "Failed to delete video",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
