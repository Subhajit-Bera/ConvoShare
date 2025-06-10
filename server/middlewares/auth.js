import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
// import { adminSecretKey } from "../app.js";
import { CONVO_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
import rateLimit from "express-rate-limit";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[CONVO_TOKEN];

  if (!token) return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  //adding s custom property in request
  req.user = decodedData._id;

  next();
});

// Rate limiter for signup OTP requests (5 requests per 15 minutes per email)
const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  keyGenerator: (req) => req.body.email || "anonymous", // Use email as key
  handler: (req, res, next) => {
    return next(
      new ErrorHandler(
        "Too many OTP requests, please try again later",
        429
      )
    );
  },
});

// Rate limiter for reset password link requests (3 requests per 15 minutes per email)
const resetLinkRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 requests per window
  keyGenerator: (req) => req.body.email || "anonymous", // Use email as key
  handler: (req, res, next) => {
    return next(
      new ErrorHandler(
        "Too many reset link requests, please try again later",
        429
      )
    );
  },
});


const adminOnly = async (req, res, next) => {
  // const token = req.cookies["convo-admin-token"];
  console.log(req.user)
  const user = await User.findById(req.user);
  console.log(user)
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isAdmin) {
    console.log("true")
    next();
  } else {
    console.log(false)
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }
  // if (!token)


  // const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  // const isMatched = secretKey === adminSecretKey;

  // if (!isMatched)
  //   return next(new ErrorHandler("Only Admin can access this route", 401));

  // next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CONVO_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    //Saving the info of user in socket ,so that we can access every user from socket
    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, otpRateLimiter, resetLinkRateLimiter, adminOnly, socketAuthenticator }