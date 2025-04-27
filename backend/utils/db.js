import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB Connected");
    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
