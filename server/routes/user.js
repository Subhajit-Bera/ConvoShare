import express from "express";
import { login,newUser,getMyProfile,logout,searchUser } from "../controllers/user.js";
import { singleAvatar, attachmentsMulter } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator,validateHandler,loginValidator } from "../lib/validators.js";

const app = express.Router();


app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser);
app.post("/login",loginValidator(),validateHandler,login);


//User have to be login
// app.get("/me",isAuthenticated, getMyProfile); 
// All the routes will contain isAuthenticated function so we add it using use, so t will be added with every route 

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);


export default app;