import express from "express";
import { createJob, deleteJob, getAllJobs, getJob, udpdateJob } from "../controllers/jobControllers.js";
import { authenticatedUser } from "../middleware/authMiddleware.js";

const jobRouter = express.Router();

jobRouter.route("/").get(authenticatedUser, getAllJobs).post(authenticatedUser, createJob)
jobRouter.route("/:id").get(authenticatedUser,getJob).delete(authenticatedUser, deleteJob).patch(authenticatedUser, udpdateJob)


export default jobRouter