import Post from "../models/Post.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

/* ======================
   CREATE POST
====================== */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content && !req.file) {
      return res
        .status(400)
        .json({ message: "Post must have text or media" });
    }

    let media = null;

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video");
      const isPdf = req.file.mimetype === "application/pdf";

      const resourceType = isPdf
        ? "raw"
        : isVideo
        ? "video"
        : "image";

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: resourceType }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(req.file.buffer);
      });

      media = {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: resourceType
      };
    }

    const post = await Post.create({
      user: req.userId,
      content,
      media
    });

    const populatedPost = await post.populate("user", "name avatar");

    // 🔥 REALTIME — broadcast to ALL users
    // 🔥 REALTIME — broadcast (include author)
    req.io?.emit("new-post", {
      post: populatedPost._id,
      authorId: req.userId
    });

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

/* ======================
   GET POSTS
====================== */
export const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");

    const total = await Post.countDocuments();

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

/* ======================
   LIKE / UNLIKE
====================== */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.userId.toString();
    const liked = post.likes.some((u) => u.toString() === userId);

    post.likes = liked
      ? post.likes.filter((u) => u.toString() !== userId)
      : [...post.likes, userId];

    await post.save();

    // 🔔 LIKE NOTIFICATION (only on LIKE, not unlike)
if (!liked && post.user.toString() !== req.userId) {
  const notif = await Notification.create({
    user: post.user,
    type: "like",
    from: req.userId,
    post: post._id
  });

  // send realtime notification to post owner
  req.io.to(`user-${post.user}`).emit("notification", notif);
}


    // 🔥 REALTIME — broadcast
    req.io?.emit("post-liked", {
      postId: post._id,
      likesCount: post.likes.length
    });

    res.json({ likesCount: post.likes.length });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Like failed" });
  }
};

/* ======================
   EDIT POST
====================== */
export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.content = req.body.content ?? post.content;
await post.save();

// 🔥 FULLY repopulate post INCLUDING comments
const updated = await Post.findById(post._id)
  .populate("user", "name avatar")
  .populate("comments.user", "name avatar");

// 🔥 emit with actorId to avoid self-echo
req.io?.emit("post-updated", {
  post: updated,
  actorId: req.userId
});

res.json(updated);

  } catch (err) {
    console.error("EDIT ERROR:", err);
    res.status(500).json({ message: "Edit failed" });
  }
};

/* ======================
   DELETE POST
====================== */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.media?.public_id) {
      const options =
        post.media.resource_type === "image"
          ? {}
          : { resource_type: post.media.resource_type };

      await cloudinary.uploader.destroy(post.media.public_id, options);
    }

    await post.deleteOne();

    req.io?.emit("post-deleted", {
      postId: post._id
    });

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ======================
   ADD COMMENT
====================== */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.unshift({
      user: req.userId,
      text
    });

    await post.save();

    // 🔔 COMMENT NOTIFICATION
if (post.user.toString() !== req.userId) {
  const notif = await Notification.create({
    user: post.user,
    type: "comment",
    from: req.userId,
    post: post._id
  });

  req.io.to(`user-${post.user}`).emit("notification", notif);
}

    await post.populate("comments.user", "name avatar");

    req.io?.emit("comment-added", {
      postId: post._id,
      comments: post.comments
    });

    res.json(post.comments);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Comment failed" });
  }
};
