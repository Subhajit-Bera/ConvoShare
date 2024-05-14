import express from "express";
import {allUsers,allChats,allMessages} from "../controllers/admin.js";


const app = express.Router();


app.get("/users", allUsers);

app.get("/chats", allChats);

app.get("/messages", allMessages);

export default app;
