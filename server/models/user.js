import mongoose, { Schema, model } from "mongoose";
import { hash } from "bcrypt";

// const schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     bio: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       select: false, //When fetch user data password will not shown
//     },
//     avatar: {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );



const schema = new Schema(
  {
    name: {
      type: String, required: true
    },

    bio: {
      type: String, required: true
    },
    username: {
      type: String, required: true, unique: true
    },
    email: {
      type: String, required: true, unique: true, lowercase: true
    },
    password: {
      type: String, required: true, select: false
    },
    avatar: {
      public_id: {
        type: String, required: true
      },
      url: {
        type: String, required: true
      }
    },
    friends:
      [
        { type: Schema.Types.ObjectId, ref: 'User' }
      ],
    isAdmin: {
      type: Boolean, default: false
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  }, { timestamps: true });


schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", schema);
