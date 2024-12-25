import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    default: 5,
  },
});

const userModel = mongoose.models.users || mongoose.model("User", userSchema);

export default userModel;

