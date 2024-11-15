import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const { name, email, password, lastName, location } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    location,
  });

  res.status(201).json({
    status: "success",
    newUser,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect credentials",
    });
  }

  const token = createToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    user,
  });
};

export const logOut = async (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "successfully logged out",
  });
};
