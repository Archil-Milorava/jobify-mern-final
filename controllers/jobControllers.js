import Job from "../models/jobModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllJobs = async (req, res) => {
  const { search, jobType, jobStatus, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * 10;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
 

const countJobs = await Job.countDocuments(queryObject);

const countOfPages = Math.ceil(countJobs / limit);



  res.status(StatusCodes.OK).json({
    status: "success",
    countJobs,
    countOfPages,
    currentPage: page,
    jobs,
  });
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    res.status(StatusCodes.OK).json({
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: "success",
    job,
  });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    status: "job successfully deleted",
  });
};

export const udpdateJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    msg: "job successfully updated",
  });
};
