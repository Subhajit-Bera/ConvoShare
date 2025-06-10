import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";
import nodemailer from 'nodemailer';

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

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        // service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },

    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for ConvoShare App Registration',
        text: `Your OTP for registration is: ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (email, subject, html) => {
    // Mock implementation; replace with your email service (e.g., Nodemailer, SendGrid)
    console.log(`Sending email to ${email}: ${subject}`);
    console.log(html);
    // Example: await nodemailer.sendMail({ to: email, subject, html });

    const transporter = nodemailer.createTransport({
        // service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },

    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);

}

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (err) {
        throw new Error("Error uploading files to cloudinary", err);
    }
};



const deletFilesFromCloudinary = async (public_ids) => {
    // Delete files from cloudinary
};

export { connectDB, sendToken, cookieOptions, emitEvent, deletFilesFromCloudinary, uploadFilesToCloudinary, sendOTPEmail, sendResetEmail, generateOTP}