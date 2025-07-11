import express from "express";
import { allUsers, allChats, allMessages, getDashboardStats, adminLogin, adminLogout, getAdminData } from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { isAuthenticated, adminOnly } from "../middlewares/auth.js";
const app = express.Router();


// app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

// app.get("/logout", adminLogout);


//Routes only admin can access
app.use(isAuthenticated, adminOnly);

app.get("/", getAdminData);

app.get("/users", allUsers);

app.get("/chats", allChats);

app.get("/messages", allMessages);

app.get("/stats", getDashboardStats);

export default app;
