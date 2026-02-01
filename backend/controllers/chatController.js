import Chat from "../models/Chat.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  let chat = await Chat.findOne({
    users: { $all: [req.userId, userId] }
  })
    .populate("users", "name avatar")
    .populate("latestMessage");

  if (chat) return res.json(chat);

  const newChat = await Chat.create({
    users: [req.userId, userId]
  });

  const fullChat = await Chat.findById(newChat._id)
    .populate("users", "name avatar");

  res.status(201).json(fullChat);
};

export const fetchChats = async (req, res) => {
  const chats = await Chat.find({
    users: req.userId
  })
    .populate("users", "name avatar")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.json(chats);
};
