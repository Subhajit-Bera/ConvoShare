import { User } from "../models/user.js";
import { Otp } from "../models/otp.js";
import { compare } from "bcrypt";
import { TryCatch } from "../middlewares/error.js"
import { ErrorHandler } from "../utils/utility.js"
import { cookieOptions, uploadFilesToCloudinary, sendToken, emitEvent } from "../utils/features.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { sendOTPEmail, sendResetEmail, generateOTP} from "../utils/features.js";
import jwt from "jsonwebtoken";

const requestOTP = TryCatch(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Please provide an email", 400));

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new ErrorHandler("Email already registered", 400));

    const otp = generateOTP();

    // Store OTP in database
    await Otp.findOneAndUpdate(
        { email },
        { email, otp },
        { upsert: true, new: true }
    );

    // Send OTP email
    try {
        await sendOTPEmail(email, otp);
    } catch (error) {
        await Otp.deleteOne({ email }); // Clean up on email failure
        return next(new ErrorHandler("Failed to send OTP", 500));
    }

    return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
    });
});

const newUser = TryCatch(async (req, res, next) => {
    const { name, username, email, password, bio, otp } = req.body;
    const file = req.file;
    console.log(otp);

    if (!file) return next(new ErrorHandler("Please Upload Avatar", 400));

    // Verify OTP
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) return next(new ErrorHandler("OTP not found or expired", 400));
    if (otpRecord.otp !== otp) return next(new ErrorHandler("Invalid OTP", 400));

    // Upload avatar
    const result = await uploadFilesToCloudinary([file]);
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };

    // Create user
    const user = await User.create({
        name,
        username,
        email,
        password,
        bio,
        avatar,
        isAdmin: false,
    });

    // Delete OTP after successful verification
    await Otp.deleteOne({ email });

    sendToken(res, user, 201, "User created");
});

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username)
    console.log(password)

    const user = await User.findOne({ username }).select("+password");
    console.log(user)

    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await compare(password, user.password);

    if (!isMatch)
        return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
})

const requestResetLink = TryCatch(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Please provide an email", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("Email not registered", 404));

    // Generate JWT token
    const resetToken = jwt.sign(
        { userId: user._id },
        process.env.RESET_PASSWORD_SECRET || "reset-secret",
        { expiresIn: "1h" }
    );

    // Store token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset link email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
    <p>You requested a password reset for your Convo account.</p>
    <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, ignore this email.</p>
  `;

    try {
        await sendResetEmail(email, "Password Reset Request", html);
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return next(new ErrorHandler("Failed to send reset link", 500));
    }

    return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
    });
});

const resetPassword = TryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return next(new ErrorHandler("Please provide a new password", 400));

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET || "reset-secret");
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired reset link", 400));
    }

    const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) return next(new ErrorHandler("Invalid or expired reset link", 400));

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});

const getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.user);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
        success: true,
        user,
    });
}

const logout = TryCatch(async (req, res) => {
    return res
        .status(200)
        .cookie("convo-token", "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});


const searchUser = TryCatch(async (req, res) => {

    const { name = "" } = req.query;

    // Finding All my chats
    const myChats = await Chat.find({ isGroupChat: false, members: req.user });
    const { friends } = await User.findById(req.user).select("friends");
    console.log(friends)

    //  extracting All Users from my chats means friends or people I have chatted with(including me)
    //flat (): [[1,2,3],[4,5]]=[1,2,3,4,5]
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);


    // Finding all users except me and my friends
    // const allUsersExceptMeAndFriends = await User.find({
    //     _id: { $nin: allUsersFromMyChats },
    //     name: { $regex: name, $options: "i" },
    // });

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: friends },
        name: { $regex: name, $options: "i" },
    });

    // Modifying the response
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url, //Beacuse we are only taking the avatar url,not public id in frontend
    }));



    return res.status(200).json({
        success: true,
        users,
    });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    });

    if (request) return next(new ErrorHandler("Request already sent", 400));

    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    //[userId] : We will create the function which will take an array
    // emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
        success: true,
        message: "Friend Request Sent",
    });
});

// const sendFriendRequest = TryCatch(async (req, res, next) => {
//   const { userId } = req.body;

//   const user = await User.findById(req.user).select("friends");
//   if (user.friends.includes(userId))
//     return next(new ErrorHandler("User is already a friend", 400));

//   const request = await Request.findOne({
//     $or: [
//       { sender: req.user, receiver: userId },
//       { sender: userId, receiver: req.user },
//     ],
//   });

//   if (request) return next(new ErrorHandler("Request already sent", 400));

//   await Request.create({
//     sender: req.user,
//     receiver: userId,
//   });

//   emitEvent(req, NEW_REQUEST, [userId]);

//   return res.status(200).json({
//     success: true,
//     message: "Friend Request Sent",
//   });
// });

// const acceptFriendRequest = TryCatch(async (req, res, next) => {
//     const { requestId, accept } = req.body;

//     const request = await Request.findById(requestId)
//         .populate("sender", "name")
//         .populate("receiver", "name");

//     if (!request) return next(new ErrorHandler("Request not found", 404));

//     if (request.receiver._id.toString() !== req.user.toString())
//         return next(
//             new ErrorHandler("You are not authorized to accept this request", 401)
//         );

//     //If request not accepted then delete the request
//     if (!accept) {
//         await request.deleteOne();

//         return res.status(200).json({
//             success: true,
//             message: "Friend Request Rejected",
//         });
//     }

//     //If request is accepted

//     //create members array of sender and reciver id
//     const members = [request.sender._id, request.receiver._id];

//     //Create one-on-one chat for seder & reciever
//     await Promise.all([
//         Chat.create({
//             members,
//             name: `${request.sender.name}-${request.receiver.name}`,
//         }),
//         request.deleteOne(),
//     ]);

//     emitEvent(req, REFETCH_CHATS, members);

//     return res.status(200).json({
//         success: true,
//         message: "Friend Request Accepted",
//         senderId: request.sender._id,
//     });
// });

const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("receiver", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));

    if (request.receiver._id.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not authorized to accept this request", 401));

    if (!accept) {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected",
        });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            isGroupChat: false,
            name: `${request.sender.name} & ${request.receiver.name}`,
            members,
        }),
        User.updateOne(
            { _id: request.sender._id },
            { $addToSet: { friends: request.receiver._id } }
        ),
        User.updateOne(
            { _id: request.receiver._id },
            { $addToSet: { friends: request.sender._id } }
        ),
        request.deleteOne(),
    ]);

    // emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});

const getMyNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({ receiver: req.user }).populate(
        "sender",
        "name avatar"
    );

    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        },
    }));

    return res.status(200).json({
        success: true,
        allRequests,
    });
});

//one-on-one Chats
// const getMyFriends = TryCatch(async (req, res) => {
//     const chatId = req.query.chatId;

//     const chats = await Chat.find({
//         members: req.user,
//         groupChat: false,
//     }).populate("members", "name avatar");

//     const friends = chats.map(({ members }) => {
//         const otherUser = getOtherMember(members, req.user);

//         return {
//             _id: otherUser._id,
//             name: otherUser.name,
//             avatar: otherUser.avatar.url,
//         };
//     });

//     //It is for group Chat : Adding members in Group 

//     if (chatId) {
//         const chat = await Chat.findById(chatId);

//         //If friend is already included in the group it will filter out that friend and show the remaining
//         const availableFriends = friends.filter(
//             (friend) => !chat.members.includes(friend._id)
//         );

//         return res.status(200).json({
//             success: true,
//             friends: availableFriends,
//         });
//     } else {
//         return res.status(200).json({
//             success: true,
//             friends,
//         });
//     }
// });


const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;

    const user = await User.findById(req.user).populate("friends", "name avatar");

    if (!user) return next(new ErrorHandler("User not found", 404));

    const friends = user.friends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    if (chatId) {
        const chat = await Chat.findById(chatId).populate("members", "_id");

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        const availableFriends = friends.filter(
            friend => !chat.members.some(member => member._id.toString() === friend._id)
        );

        return res.status(200).json({
            success: true,
            friends: availableFriends,
        });
    }

    return res.status(200).json({
        success: true,
        friends,
    });
});

export { requestOTP, newUser, login, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getMyNotifications, getMyFriends, requestResetLink, resetPassword }