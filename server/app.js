import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";


dotenv.config({
    path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
connectDB(mongoURI);

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
    res.send("Hello World");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});
