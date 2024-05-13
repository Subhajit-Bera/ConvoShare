import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments,getChatDetails,renameGroup ,deleteChat,getMessages} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {validateHandler,newGroupValidator,addMemberValidator,removeMemberValidator,leaveGroupValidator} from "../lib/validators.js";
const app = express.Router();

app.use(isAuthenticated);

app.post("/new",newGroupValidator(),validateHandler,newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(),validateHandler,addMembers);

app.put("/removemember",removeMemberValidator(),validateHandler, removeMember);
app.delete("/leave/:id",leaveGroupValidator(),validateHandler,leaveGroup);

app.post("/message",attachmentsMulter,sendAttachments);

// Get Messages
app.get("/message/:id",getMessages);
app
  .route("/:id")
  .get(getChatDetails)
  .put( renameGroup)
  .delete(deleteChat);
export default app;