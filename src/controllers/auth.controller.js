import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const checkAuth = async (req, res) => {
  try {
    const { clerkUser } = req;

    let user = await User.findOne({ clerkUserId: clerkUser.id });

    if (!user) {
      user = new User({
        clerkUserId: clerkUser.id,
        email: clerkUser.email,
        fullName: clerkUser.fullName,
        profilePic: clerkUser.profilePic,
        password: "clerk-auth",
      });
      await user.save();
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const syncClerkUser = async (req, res) => {
  try {
    const { clerkUser } = req;
    console.log("Clerk user data received:", clerkUser);

    if (!clerkUser.id) {
      return res.status(400).json({
        message:
          "User ID not found in JWT. Please ensure you are properly authenticated.",
      });
    }

    if (!clerkUser.email || !clerkUser.fullName) {
      console.log(
        "Incomplete user data in JWT, proceeding with available data"
      );
    }

    let user = await User.findOne({
      $or: [{ clerkUserId: clerkUser.id }, { email: clerkUser.email }],
    });

    if (user) {
      user.clerkUserId = clerkUser.id;
      if (clerkUser.email) user.email = clerkUser.email;
      if (clerkUser.fullName) user.fullName = clerkUser.fullName;
      if (clerkUser.profilePic) user.profilePic = clerkUser.profilePic;
      await user.save();
      console.log("Updated existing user:", user._id);
    } else {
      user = new User({
        clerkUserId: clerkUser.id,
        email: clerkUser.email || `user_${clerkUser.id}@placeholder.com`,
        fullName: clerkUser.fullName || "User",
        profilePic: clerkUser.profilePic || "",
        password: "clerk-auth",
      });
      await user.save();
      console.log("Created new user:", user._id);
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in syncClerkUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const { clerkUser } = req;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const user = await User.findOne({ clerkUserId: clerkUser.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
