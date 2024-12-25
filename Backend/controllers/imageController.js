import FormData from "form-data";
import userModel from "../models/userModel.js";
import axios from "axios";

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await userModel.findById(userId);
    

    if (!user || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    if (user.creditBalance === 0 || userModel.creditBalance < 0) {
      return res.status(406).json({
        success: false,
        message: "No credit Balance is Left.",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );
    console.log(data);

    const base64Image = Buffer.from(data, "binary").toString("base64");

    console.log(base64Image);

    const resultImage = `data:image/png;base64,${base64Image}`;

    console.log(resultImage);

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Image Generated Successfully",
        creditBalance: user.creditBalance - 1,
        resultImage
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { generateImage };
