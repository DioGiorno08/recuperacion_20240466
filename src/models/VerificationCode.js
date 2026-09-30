import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  name: {type:String,required:true},
  password: {type:String,required:true},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  codeHash: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

export default mongoose.model("VerificationCode", verificationCodeSchema);
