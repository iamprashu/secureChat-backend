import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { getSocketInstance } from "../lib/socketInstance.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const { clerkUser } = req;

    const currentUser = await User.findOne({ clerkUserId: clerkUser.id });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredUsers = await User.find({
      _id: { $ne: currentUser._id },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { clerkUser } = req;

    const currentUser = await User.findOne({ clerkUserId: clerkUser.id });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUser._id, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUser._id },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, encryptedMessage, encryptedAESKeys } = req.body;
    const { id: receiverId } = req.params;
    const { clerkUser } = req;

    const currentUser = await User.findOne({ clerkUserId: clerkUser.id });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: currentUser._id,
      receiverId,
      text: text || null,
      image: imageUrl,
      encryptedMessage: encryptedMessage || null,
      encryptedAESKeys: encryptedAESKeys || null,
    });

    await newMessage.save();

    let messageToSend = newMessage.toObject();
    
    if (messageToSend.encryptedAESKeys && typeof messageToSend.encryptedAESKeys === 'object') {
      if (messageToSend.encryptedAESKeys instanceof Map) {
        messageToSend.encryptedAESKeys = Object.fromEntries(messageToSend.encryptedAESKeys);
      }
    }
    


    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      getSocketInstance()
        .to(receiverSocketId)
        .emit("newMessage", messageToSend);
    }

    const senderSocketId = getReceiverSocketId(currentUser._id);
    if (senderSocketId) {
      getSocketInstance()
        .to(senderSocketId)
        .emit("newMessage", messageToSend);
    }

    res.status(201).json(messageToSend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
