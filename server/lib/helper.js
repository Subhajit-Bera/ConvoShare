import { userSocketIDs } from "../app.js";

//Returning the other member 
export const getOtherMember = (members, userId) =>
    members.find((member) => member._id.toString() !== userId.toString());


//Provide the socket of the user, we need to send the message
export const getSockets = (users = []) => {  //here users is memebers of the chat
    const sockets = users.map((user) => userSocketIDs.get(user.toString()));

    return sockets;
};

export const getBase64 = (file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
