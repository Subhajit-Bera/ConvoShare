import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
// import { createUser } from "./seeders/user.js"; for creave fake user : createUser(10);
import { Server } from "socket.io";
import { NEW_MESSAGE,NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

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

const userSocketIDs = new Map(); //mapping userId(active/online) with socket id

connectDB(mongoURI);


//Create Server
const app = express();
const server = createServer(app);
const io = new Server(server, {});

// Using Middlewares Here
app.use(express.json());
app.use(cookieParser()); //so that we can access cookie from request

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});

//Socket IO

io.on("connection", (socket) => {
    const user = {
        _id: "sadsad",
        name: "Zinku"
    }

    //mapping user._id with socket.id after the user connected with socket
    userSocketIDs.set(user._id.toString(), socket.id);
    console.log(userSocketIDs);
    // console.log("a user connected", socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {


        //Message for showing in chat Realtime
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        //Message saved in db and fetch for showing in chat
        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

        try {
            await Message.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }

        console.log("New Message", messageForRealTime)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected");
        //When user disconected it will be deleted from the map
        userSocketIDs.delete(user._id.toString());
    });
})

app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { adminSecretKey, envMode, userSocketIDs }