import multer from "multer";

const storage = multer.memoryStorage();

/* ======================
   AVATAR UPLOAD (IMAGE ONLY)
====================== */
export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for avatar
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      cb(new Error("Only image files allowed for avatar"), false);
    } else {
      cb(null, true);
    }
  }
});

/* ======================
   POST MEDIA UPLOAD
====================== */
export const postUpload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB (image/video/pdf)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "application/pdf"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Unsupported file type"), false);
    } else {
      cb(null, true);
    }
  }
});
