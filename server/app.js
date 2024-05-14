import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
// import { createUser } from "./seeders/user.js"; for creave fake user : createUser(10);

//Import Routes
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";


//Setup dotenv
dotenv.config({
    path: "./.env",
});

//Database connection
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || sfusfusfusfusfu;
connectDB(mongoURI);


//Create Server
const app = express();
const server = createServer(app);


// Using Middlewares Here
app.use(express.json());
app.use(cookieParser()); //so that we can access cookie from request

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { adminSecretKey, envMode }