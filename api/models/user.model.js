import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: 'https://i.pinimg.com/564x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg'
      }

}, { timestamps: true });

const User = mongoose.model('User', userSchema)
export default User;