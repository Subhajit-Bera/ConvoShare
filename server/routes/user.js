import express from "express";
import { login,newUser,getMyProfile } from "../controllers/user.js";
import { singleAvatar, attachmentsMulter } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();


app.post("/new",singleAvatar,newUser);
app.post("/login",login);


//User have to be login
// app.get("/me",isAuthenticated, getMyProfile); 
// All the routes will contain isAuthenticated function so we add it using use, so t will be added with every route 

app.use(isAuthenticated);

app.get("/me", getMyProfile);

// app.get("/logout", logout);



export default app;