import cloudinary from "cloudinary";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.delete("/:public_id", async (req, res) => {
  console.log("delete initiated")
  const { public_id } = req.params;
    console.log("public id",public_id);
  try {
    await cloudinary.uploader.destroy(public_id);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
