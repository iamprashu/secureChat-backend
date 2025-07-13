import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "clerk-auth",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
