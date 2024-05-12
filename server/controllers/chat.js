import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";

const newGroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body;

    const allMembers = [...members, req.user];

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers,
    });


    //ALERT : This event is for every members of the group(including creator of the group)
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    //REFETCH_CHATS: It will refetch the chats of other member of the group excluding the creator of the group
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
        success: true,
        message: "Group Created",
    });
});

const getMyChats = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        members: req.user  //Find members in which my id is present 
    }).populate("members", "name avatar"); //populate members and take name & avatar from memebers

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        //Get the other member 
        const otherMember = getOtherMember(members, req.user);

        return {
            _id,
            groupChat,


            avatar: groupChat
                ? members.slice(0, 3).map(({ avatar }) => avatar.url) //Incase of group chat we only show three mwmbers
                : [otherMember.avatar.url],


            name: groupChat ? name : otherMember.name, //if group chat show group name OR other user name

            members: members.reduce((prev, curr) => {  //We only want the id's of other members excluding me
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, []),
        };
    });

    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});

const getMyGroups = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user,
    }).populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

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

    if (!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    if (chat.creator.toString() !== req.user.toString())
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
    if (chat.members.length > 100)
        return next(new ErrorHandler("Group members limit reached", 400));

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(", ");

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in the group`
    );

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Members added successfully",
    });
});

export { newGroupChat, getMyChats, getMyGroups,addMembers }