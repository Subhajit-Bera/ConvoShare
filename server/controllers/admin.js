import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";
// import { adminSecretKey } from "../app.js";

const adminLogin = TryCatch(async (req, res, next) => {
    const { secretKey } = req.body;

    // const isMatched = secretKey === adminSecretKey;

    if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

    const token = jwt.sign(secretKey, process.env.JWT_SECRET);

    return res
        .status(200)
        .cookie("convo-admin-token", token, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15,
        })
        .json({
            success: true,
            message: "Authenticated Successfully, Welcome Admin",
        });
});

const adminLogout = TryCatch(async (req, res, next) => {
    return res
        .status(200)
        .cookie("convo-admin-token", "", {
            ...cookieOptions,
            maxAge: 0,
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
});

const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        admin: true,
    });
});

const allUsers = TryCatch(async (req, res) => {
    const users = await User.find({});

    //.....
    const transformedUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id, friends }) => {
            // const [groups, friends] = await Promise.all([
            //     Chat.countDocuments({ isGroupChat: true, members: _id }), //group count
            //     Chat.countDocuments({ isGroupChat: false, members: _id }), //friends count
            // ]);
            const groups = await Chat.countDocuments({ isGroupChat: true, members: _id });

            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends: friends.length,
            };
        })
    );

    return res.status(200).json({
        status: "success",
        users: transformedUsers,
    });
});


// const allChats = TryCatch(async (req, res) => {
//     const chats = await Chat.find({})
//         .populate("members", "name avatar")
//         .populate("creator", "name avatar");

//     const transformedChats = await Promise.all(
//         chats.map(async ({ members, _id, isGroupChat, name, creator }) => {
//             const totalMessages = await Message.countDocuments({ chat: _id });

//             return {
//                 _id,
//                 isGroupChat,
//                 name,
//                 avatar: members.slice(0, 3).map((member) => member.avatar.url),
//                 members: members.map(({ _id, name, avatar }) => ({
//                     _id,
//                     name,
//                     avatar: avatar.url,
//                 })),
//                 creator: {
//                     name: creator?.name || "None",
//                     avatar: creator?.avatar.url || "",
//                 },
//                 totalMembers: members.length,
//                 totalMessages,
//             };
//         })
//     );

//     return res.status(200).json({
//         status: "success",
//         chats: transformedChats,
//     });
// });

const allChats = TryCatch(async (req, res) => {
    const chats = await Chat.find({}).populate("members", "name avatar");

    const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, isGroupChat, name, admins }) => {
            const totalMessages = await Message.countDocuments({ chat: _id });

            return {
                _id,
                isGroupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url,
                })),
                creator: admins.length > 0
                    ? { name: (await User.findById(admins[0])).name, avatar: (await User.findById(admins[0])).avatar.url }
                    : { name: "None", avatar: "" },
                totalMembers: members.length,
                totalMessages,
            };
        })
    );

    return res.status(200).json({
        status: "success",
        chats: transformedChats,
    });
});

const allMessages = TryCatch(async (req, res) => {
    const messages = await Message.find({})
        .populate("sender", "name avatar")
        .populate("chat", "isGroupChat");

    const transformedMessages = messages.map(
        ({ content, attachments, _id, sender, createdAt, chat }) => ({
            _id,
            attachments,
            content,
            createdAt,
            chat: chat._id,
            isGroupChat: chat.isGroupChat,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },
        })
    );

    return res.status(200).json({
        success: true,
        messages: transformedMessages,
    });
});

const getDashboardStats = TryCatch(async (req, res) => {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
        await Promise.all([
            Chat.countDocuments({ isGroupChat: true }),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments(),
        ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today,
        },
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
        const indexApprox =
            (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
        const index = Math.floor(indexApprox);

        messages[6 - index]++;
    });

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    };

    return res.status(200).json({
        success: true,
        stats,
    });
});

///
const newUsersToday = TryCatch(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const users = await User.find({
        createdAt: { $gte: today, $lt: tomorrow },
    }).select("name username avatar createdAt");

    const transformedUsers = users.map(({ name, username, avatar, _id, createdAt }) => ({
        _id,
        name,
        username,
        avatar: avatar.url,
        createdAt,
    }));

    return res.status(200).json({
        success: true,
        users: transformedUsers,
    });
});

const newUsersLastWeek = TryCatch(async (req, res) => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const users = await User.find({
        createdAt: { $gte: lastWeek, $lte: today },
    }).select("name username avatar createdAt");

    const transformedUsers = users.map(({ name, username, avatar, _id, createdAt }) => ({
        _id,
        name,
        username,
        avatar: avatar.url,
        createdAt,
    }));

    return res.status(200).json({
        success: true,
        users: transformedUsers,
    });
});

const newUsersByMonthYear = TryCatch(async (req, res, next) => {
    const { month, year } = req.query;

    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month) - 1; // JavaScript months are 0-based

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11)
        return next(new ErrorHandler("Invalid month or year", 400));

    const startDate = new Date(parsedYear, parsedMonth, 1);
    const endDate = new Date(parsedYear, parsedMonth + 1, 1);

    const users = await User.find({
        createdAt: { $gte: startDate, $lt: endDate },
    }).select("name username avatar createdAt");

    const transformedUsers = users.map(({ name, username, avatar, _id, createdAt }) => ({
        _id,
        name,
        username,
        avatar: avatar.url,
        createdAt,
    }));

    return res.status(200).json({
        success: true,
        users: transformedUsers,
    });
});

const newGroupsToday = TryCatch(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groups = await Chat.find({
        isGroupChat: true,
        createdAt: { $gte: today, $lt: tomorrow },
    }).populate("members", "name avatar");

    const transformedGroups = groups.map(({ members, _id, isGroupChat, name, admins }) => ({
        _id,
        isGroupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
        })),
        creator: admins.length > 0 ? { name: "Admin", avatar: "" } : { name: "None", avatar: "" },
    }));

    return res.status(200).json({
        success: true,
        groups: transformedGroups,
    });
});

const newChatsToday = TryCatch(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const chats = await Chat.find({
        isGroupChat: false,
        createdAt: { $gte: today, $lt: tomorrow },
    }).populate("members", "name avatar");

    const transformedChats = chats.map(({ members, _id, isGroupChat, name }) => ({
        _id,
        isGroupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
        })),
    }));

    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});

const newChatsByPeriod = TryCatch(async (req, res, next) => {
    const { period, year } = req.query;

    let startDate, endDate;
    const today = new Date();

    if (period === "lastWeek") {
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        endDate = today;
    } else if (period === "lastMonth") {
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        endDate = today;
    } else if (period === "specificYear" && year) {
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear)) return next(new ErrorHandler("Invalid year", 400));
        startDate = new Date(parsedYear, 0, 1);
        endDate = new Date(parsedYear + 1, 0, 1);
    } else {
        return next(new ErrorHandler("Invalid period", 400));
    }

    const chats = await Chat.find({
        createdAt: { $gte: startDate, $lte: endDate },
    }).populate("members", "name avatar");

    const transformedChats = chats.map(({ members, _id, isGroupChat, name, admins }) => ({
        _id,
        isGroupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
        })),
        creator: admins.length > 0 ? { name: "Admin", avatar: "" } : { name: "None", avatar: "" },
    }));

    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});


export { allUsers, allChats, allMessages, getDashboardStats, adminLogin, adminLogout, getAdminData }