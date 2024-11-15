import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    jobStatus: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    jobLocation: {
      type: String,
      default: "my city",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Job = new mongoose.model("Job", JobSchema);

export default Job;
