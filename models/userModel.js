import mongoose from "mongoose";

const USerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: String,
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
}, {
  timestamps: true
});

const User = new mongoose.model("User", USerSchema);

export default User;
