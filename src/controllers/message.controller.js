import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encryptMessage, decryptMessage } from "../lib/encryption.js";

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
    console.error("Error in getUsersForSidebar: ", error.message);
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

    const decryptedMessages = messages.map((message) => ({
      ...message.toObject(),
      text: decryptMessage(message.text),
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
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

    const encryptedText = encryptMessage(text);

    const newMessage = new Message({
      senderId: currentUser._id,
      receiverId,
      text: encryptedText,
      image: imageUrl,
    });

    await newMessage.save();

    const decryptedMessage = {
      ...newMessage.toObject(),
      text: decryptMessage(encryptedText),
    };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", decryptedMessage);
    }

    const senderSocketId = getReceiverSocketId(currentUser._id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", decryptedMessage);
    }

    res.status(201).json(decryptedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
