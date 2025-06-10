import mongoose, { Schema, model, Types } from "mongoose";

// const schema = new Schema(
//   {
//     content: String,

//     attachments: [
//       {
//         public_id: {
//           type: String,
//           required: true,
//         },
//         url: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//     sender: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     chat: {
//       type: Types.ObjectId,
//       ref: "Chat",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


const schema = new Schema({
  content: { type: String, trim: true },
  attachments: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  }],
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Message = mongoose.models.Message || model("Message", schema);
