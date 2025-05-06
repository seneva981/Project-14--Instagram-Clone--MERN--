import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const blacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);

export default blacklistToken;
