import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

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
app.use(cookieParser()); //so that we can access cookie from request

app.use("/api/v1/user", userRoute);


app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});
