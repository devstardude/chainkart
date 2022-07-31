import mongoose from 'mongoose';

const connectDB = async (cb) => {
  try {
    const conn = await mongoose.connect("mongodb+srv://admin-dude:Test123@cluster0-ywqxa.gcp.mongodb.net/ecommerse-nft?retryWrites=true&w=majority", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline);
    cb();
  } catch (error) {
    console.log(`Error : ${error.message}`.red.underline.bold);
  }
};

export default connectDB;
