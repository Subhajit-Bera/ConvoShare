import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};


//Database Connection
const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "ConvoShare" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
            throw err;
        });
};


//For set cookie
const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(code).cookie("convo-token", token, cookieOptions).json({
        success: true,
        user,
        message,
    });
};




export { connectDB,sendToken,cookieOptions }