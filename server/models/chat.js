import mongoose, { Schema, model, Types } from "mongoose";

// const schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     groupChat: {
//       type: Boolean,
//       default: false,
//     },
//     creator: {
//       type: Types.ObjectId,
//       ref: "User",
//     },
//     members: [
//       {
//         type: Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );



const schema = new Schema({
  isGroupChat: { type: Boolean, default: false },
  name: { type: String, trim: true, required: true },
  // creator: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  avatar: {
    public_id: {
      type: String
    },
    url: {
      type: String
    }
  },
  latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

export const Chat = mongoose.models.Chat || model("Chat", schema);
