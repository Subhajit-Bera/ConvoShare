import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";

//Import Routes
import userRoute from "./routes/user.js";

//Setup dotenv
dotenv.config({
    path: "./.env",
});

//Database connection
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
connectDB(mongoURI);

//Create Server
const app = express();
const server = createServer(app);


// Using Middlewares Here
app.use(express.json());


app.use("/api/v1/user", userRoute);


app.get("/", (req, res) => {
    res.send("Hello World");
});




server.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});
