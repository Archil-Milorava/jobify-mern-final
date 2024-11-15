import { verifyToken } from "../utils/tokenUtils.js";

export const authenticatedUser = (req, res, next) => {
  const { authToken } = req.cookies;
  if (!authToken) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  try {
    const user = verifyToken(authToken);
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
};
