import express from "express";
import { requestOTP, login, newUser, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getMyNotifications, getMyFriends, requestResetLink, resetPassword } from "../controllers/user.js";
import { singleAvatar, attachmentsMulter } from "../middlewares/multer.js";
import { isAuthenticated, otpRateLimiter, resetLinkRateLimiter } from "../middlewares/auth.js";
import { registerValidator, validateHandler, otpRequestValidator, loginValidator, sendRequestValidator, acceptRequestValidator, resetPasswordValidator } from "../lib/validators.js";

const app = express.Router();

app.post("/request-otp", otpRequestValidator(), validateHandler, otpRateLimiter, requestOTP);
// app.post("/newUser", singleAvatar, registerValidator(), validateHandler, newUser);

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);
app.post("/request-reset-link", resetLinkRateLimiter, requestResetLink);
app.post("/reset-password/:token", resetPasswordValidator(), validateHandler, resetPassword);

//User have to be login
// app.get("/me",isAuthenticated, getMyProfile); 
// All the routes will contain isAuthenticated function so we add it using use, so t will be added with every route 

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
    "/sendrequest",
    sendRequestValidator(),
    validateHandler,
    sendFriendRequest
);

app.put(
    "/acceptrequest",
    acceptRequestValidator(),
    validateHandler,
    acceptFriendRequest
);

app.get("/notifications", getMyNotifications);

app.get("/friends", getMyFriends);
export default app;