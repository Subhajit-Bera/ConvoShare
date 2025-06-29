import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { emitEvent, deletFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/features.js";
import { ALERT, REFETCH_CHATS, NEW_MESSAGE, NEW_MESSAGE_ALERT } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";


const newGroupChat = TryCatch(async (req, res, next) => {
    // const { name, members } = req.body;

    // const allMembers = [...members, req.user];

    // await Chat.create({
    //     name,
    //     groupChat: true,
    //     creator: req.user,
    //     members: allMembers,
    // });


    // //ALERT : This event is for every members of the group(including creator of the group)
    // emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    // //REFETCH_CHATS: It will refetch the chats of other member of the group excluding the creator of the group
    // emitEvent(req, REFETCH_CHATS, members);

    // return res.status(201).json({
    //     success: true,
    //     message: "Group Created",
    // });

    const { name, members } = req.body;
    const file = req.file;

    const allMembers = [...members, req.user];

    let avatar = null;
    if (file) {
        // const result = await uploadFilesToCloudinary([file]);
        // avatar = {
        //     public_id: result[0].public_id,
        //     url: result[0].url,
        // };

        avatar = {
            public_id: 'marionberry_um.svgz',
            url: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1046.jpg',
        };
    }

    const chat = await Chat.create({
        name,
        isGroupChat: true,
        // creator: req.user,
        members: allMembers,
        admins: [req.user], // Creator is an admin
        avatar
    });

    // emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    // emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
        success: true,
        message: "Group Created",
    });
});

// const getMyChats = TryCatch(async (req, res, next) => {
//     const chats = await Chat.find({
//         members: req.user  //Find members in which my id is present 
//     }).populate("members", "name avatar"); //populate members and take name & avatar from memebers

//     const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
//         //Get the other member 
//         const otherMember = getOtherMember(members, req.user);

//         return {
//             _id,
//             groupChat,


//             avatar: groupChat
//                 ? members.slice(0, 3).map(({ avatar }) => avatar.url) //Incase of group chat we only show three mwmbers
//                 : [otherMember.avatar.url],


//             name: groupChat ? name : otherMember.name, //if group chat show group name OR other user name

//             members: members.reduce((prev, curr) => {  //We only want the id's of other members excluding me
//                 if (curr._id.toString() !== req.user.toString()) {
//                     prev.push(curr._id);
//                 }
//                 return prev;
//             }, []),
//         };
//     });

//     return res.status(200).json({
//         success: true,
//         chats: transformedChats,
//     });
// });

const getMyChats = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user).populate("friends", "name avatar");

    if (!user) return next(new ErrorHandler("User not found", 404));

    // Fetch friend IDs for one-on-one chats
    const friendIds = user.friends.map((friend) => friend._id);

    const chats = await Chat.find({
        $or: [
            {
                isGroupChat: false,
                members: { $all: [req.user], $in: friendIds }
            },
            {
                isGroupChat: true,
                members: req.user
            }
        ]
    }).populate("members", "name avatar")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "_id name"
            }
        });

    console.log(chats);
    const transformedChats = chats.map(({ _id, name, members, isGroupChat, avatar, latestMessage }) => {
        const otherMember = getOtherMember(members, req.user);

        return {
            _id,
            isGroupChat,
            avatar: isGroupChat
                ? avatar?.url
                    ? [avatar.url]
                    : members.slice(0, 3).map(({ avatar }) => avatar.url)
                : [otherMember.avatar.url],
            name: isGroupChat ? name : otherMember.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, []),
            latestMessage: latestMessage
                ? {
                    id: latestMessage._id,
                    content: latestMessage.content || "",
                    attachments: latestMessage.attachments || [],
                    sender: {
                        _id: latestMessage.sender._id,
                        name: latestMessage.sender.name,
                    },
                    createdAt: latestMessage.createdAt,
                }
                : null,
        };
    });

    // Sort chats by createdAt (most recent first) since no latestMessage
    transformedChats.sort((a, b) => b.createdAt - a.createdAt);
    console.log(transformedChats)
    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});

const getMyGroups = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        isGroupChat: true,
        members: req.user
    }).populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name, admins, avatar }) => ({
        _id,
        groupChat,
        name,
        members,
        admins,
        avatar: avatar?.url ? [avatar.url] : members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));
    console.log(groups)

    return res.status(200).json({
        success: true,
        groups,
    });
});

//Add members to group
const addMembers = TryCatch(async (req, res, next) => {

    const { chatId, members } = req.body;

    if (!members || members.length < 1) return next(new ErrorHandler("Please provide members", 400));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    //If you are not creator of the group
    // if (chat.creator.toString() !== req.user.toString())
    //     return next(new ErrorHandler("You are not allowed to add members", 403));

    if (!chat.admins.includes(req.user.toString()))
        return next(new ErrorHandler("You are not allowed to add members", 403));

    //creates an array of promises
    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

    //waits for all promises in the allNewMembersPromise array to resolve using Promise.all()
    const allNewMembers = await Promise.all(allNewMembersPromise);

    //It will take only unique members and avoid if the member already exist in the group
    const uniqueMembers = allNewMembers
        .filter((i) => !chat.members.includes(i._id.toString()))
        .map((i) => i._id);

    chat.members.push(...uniqueMembers);

    //Setting members limit
    // if (chat.members.length > 100)
    //     return next(new ErrorHandler("Group members limit reached", 400));

    await chat.save();

    const allUsersName = uniqueMembers.map((i) => i.name).join(", ");

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in the group`
    );

    // emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Members added successfully",
    });
});


//Remove member from group
const removeMember = TryCatch(async (req, res, next) => {
    const { userId, chatId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name"),
    ]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    //If you are not creator of the group
    // if (chat.creator.toString() !== req.user.toString())
    //     return next(new ErrorHandler("You are not allowed to remove members", 403));

    if (!chat.admins.includes(req.user.toString()))
        return next(new ErrorHandler("You are not allowed to remove members", 403));

    if (chat.members.length <= 3)
        return next(new ErrorHandler("Group must have at least 3 members", 400));

    // const allChatMembers = chat.members.map((i) => i.toString());

    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );

    await chat.save();

    // emitEvent(req, ALERT, chat.members, {
    //     message: `${userThatWillBeRemoved.name} has been removed from the group`,
    //     chatId,
    // });

    // emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
});


const leaveGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
    );

    if (remainingMembers.length < 3)
        return next(new ErrorHandler("Group must have at least 3 members", 400));

    //If admin is leaving the group then we have to assign a new creator
    if (chat.admins.includes(req.user.toString())) {
        chat.admins = chat.admins.filter(
            (admin) => admin.toString() !== req.user.toString()
        );
        if (chat.admins.length === 0) {
            chat.admins.push(remainingMembers[0]);
        }
    }

    chat.members = remainingMembers;

    const [user] = await Promise.all([
        User.findById(req.user, "name"),
        chat.save(),
    ]);

    // emitEvent(req, ALERT, chat.members, {
    //     chatId,
    //     message: `User ${user.name} has left the group`,
    // });

    return res.status(200).json({
        success: true,
        message: "Leave Group Successfully",
    });
});

const sendAttachments = TryCatch(async (req, res, next) => {
    const { chatId } = req.body;

    const files = req.files || [];

    if (files.length < 1)
        return next(new ErrorHandler("Please Upload Attachments", 400));

    if (files.length > 5)
        return next(new ErrorHandler("Files Can't be more than 5", 400));

    const [chat, me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user, "name"),
    ]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (files.length < 1)
        return next(new ErrorHandler("Please provide attachments", 400));

    //   Upload files here
    const attachments = await uploadFilesToCloudinary(files);

    //For creating and Adding message in db . While fetching we will populate the sender
    const messageForDB = {
        content: "",
        attachments,
        sender: me._id,
        chat: chatId,
    };

    //Send via socket
    const messageForRealTime = {
        ...messageForDB,
        sender: {
            _id: me._id,
            name: me.name, //In chat we are also showing the name
            //We can alos pass the avater here and show it in chat
            avatar: me.avatar.url
        },
    };

    const message = await Message.create(messageForDB);

    chat.latestMessage = message._id;
    await chat.save();

    // emitEvent(req, NEW_MESSAGE, chat.members, {
    //     message: messageForRealTime,
    //     chatId,
    // });

    // emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(200).json({
        success: true,
        message,
    });
});


const getChatDetails = TryCatch(async (req, res, next) => {
    if (req.query.populate === "true") {
        const chat = await Chat.findById(req.params.id)
            .populate("members", "name avatar")
            .lean();
        //.lean(): chat becomes a js object rather than mongodb obj ,now we can change the obj without save it to db
        console.log(chat)

        if (!chat) return next(new ErrorHandler("Chat not found", 404));


        chat.members = chat.members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
        }));
        //If we save it it will update the database so we are using lean() above
        console.log(chat)

        return res.status(200).json({
            success: true,
            chat,
        });
    } else {
        const chat = await Chat.findById(req.params.id);
        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        return res.status(200).json({
            success: true,
            chat,
        });
    }
});

const renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    // if (chat.creator.toString() !== req.user.toString())
    //     return next(
    //         new ErrorHandler("You are not allowed to rename the group", 403)
    //     );

    if (!chat.admins.includes(req.user.toString()))
        return next(
            new ErrorHandler("You are not allowed to rename the group", 403)
        );

    chat.name = name;

    await chat.save();

    // emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Group renamed successfully",
    });
});

const deleteChat = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const members = chat.members;

    //If it's group chat and I am not the creator
    if (chat.isGroupChat && !chat.admins.includes(req.user.toString()))
        return next(
            new ErrorHandler("You are not allowed to delete the group", 403)
        );

    //If it is one-on-one chat and I am not included then,can't delete the chat
    if (!chat.isGroupChat && !chat.members.includes(req.user.toString())) {
        return next(
            new ErrorHandler("You are not allowed to delete the chat", 403)
        );
    }

    // Here we have to delete All Messages as well as attachments or files from cloudinary
    const messagesWithAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $ne: [] },
    });

    //Take all attachments public ids
    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) =>
        attachments.forEach(({ public_id }) => public_ids.push(public_id))
    );

    //Delete all attachments via public ids
    await Promise.all([
        deletFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ]);

    // emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
    });
});


const getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.members.includes(req.user.toString()))
        return next(
            new ErrorHandler("You are not allowed to access this chat", 403)
        );

    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 }) //sort in desc
            .skip(skip)
            .limit(resultPerPage)
            .populate("sender", "name")
            .lean(),
        Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    //need to update by populate sender
    // messages.forEach((msg) => {
    //     msg.sender.avatar = msg.sender.avatar?.url || "";
    // });

    return res.status(200).json({
        success: true,
        messages: messages.reverse(),
        totalPages,
    });
});


const updateGroupAvatar = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const file = req.file;

    if (!file) return next(new ErrorHandler("Please upload an avatar image", 400));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    if (!chat.admins.includes(req.user.toString()) && chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to update the group avatar", 403));

    if (chat.avatar?.public_id) {
        await deletFilesFromCloudinary([chat.avatar.public_id]);
    }

    const result = await uploadFilesToCloudinary([file]);
    chat.avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };

    await chat.save();

    // emitEvent(req, ALERT, chat.members, {
    //     message: `Group avatar updated`,
    //     chatId,
    // });

    // emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Group avatar updated successfully",
    });
});

const makeMemberAdmin = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { userId } = req.body;

    const [chat, user] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name"),
    ]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.isGroupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    if (!chat.admins.includes(req.user.toString()))
        return next(new ErrorHandler("You are not allowed to make members admins", 403));

    if (!user) return next(new ErrorHandler("User not found", 404));

    if (!chat.members.includes(userId))
        return next(new ErrorHandler("User is not a member of this group", 400));

    if (chat.admins.includes(userId))
        return next(new ErrorHandler("User is already an admin", 400));

    chat.admins.push(userId);

    await chat.save();

    //   emitEvent(req, ALERT, chat.members, {
    //     message: `${user.name} has been made an admin`,
    //     chatId,
    //   });

    //   emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Member made admin successfully",
    });
});



export { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, updateGroupAvatar, makeMemberAdmin }