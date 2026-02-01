import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  const message = await Message.create({
    chat: chatId,
    sender: req.userId,
    text
  });

  const populated = await Message.findById(message._id)
    .populate("sender", "name avatar")
    .populate("chat");

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: populated
  });

  // 🔔 MESSAGE NOTIFICATION
const chat = await Chat.findById(chatId);

chat.users.forEach((u) => {
  if (u.toString() !== req.userId) {
    req.io.to(`user-${u}`).emit("notification", {
      type: "message",
      from: req.userId,
      chatId
    });
  }
});


  // 🔥 REAL-TIME MESSAGE
  req.io.to(`chat-${chatId}`).emit("new-message", populated);

  res.status(201).json(populated);
};

export const fetchMessages = async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId
  }).populate("sender", "name avatar");

  res.json(messages);
};
