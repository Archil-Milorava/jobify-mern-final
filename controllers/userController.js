import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");

  res.status(200).json({
    user,
  });
};

export const updateUser = async (req, res) => {
  
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    req.body.avatar = response.secure_url;
    req.body.avatarPublicId = response.public_id;
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.file && user.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(user.avatarPublicId);
  }

  res.status(200).json({
    user,
  });
};
