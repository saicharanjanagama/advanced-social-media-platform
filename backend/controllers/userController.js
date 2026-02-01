import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

/* ======================
   UPLOAD / UPDATE AVATAR
====================== */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🧹 delete old avatar safely
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // ☁️ upload new avatar
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
            transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" }
            ]
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    user.avatar = {
      url: result.secure_url,
      public_id: result.public_id
    };

    await user.save();

    res.json({
      avatar: user.avatar
    });
  } catch (err) {
    console.error("AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
