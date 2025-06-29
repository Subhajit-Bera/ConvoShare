import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, updateGroupAvatar,
  makeMemberAdmin
} from "../controllers/chat.js";
import { attachmentsMulter, singleAvatar } from "../middlewares/multer.js";
import {
  validateHandler,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  chatIdValidator,
  renameValidator,
  makeAdminValidator
} from "../lib/validators.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

app.put("/removemember", removeMemberValidator(), validateHandler, removeMember);
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

app.post("/message", attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

// Get Messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);


app.put("/updateavatar/:id", singleAvatar, chatIdValidator(), validateHandler, updateGroupAvatar);

app.put("/makeadmin/:id", makeAdminValidator(), validateHandler, makeMemberAdmin);

export default app;