import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = userModel({
      name,
      email,
      password: hashPassword,
    });

    // const user = await userData.save();

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email ID" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (isMatchPassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.status(201).json({ success: true, token, user: { name: user.name } });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    return res
      .status(200)
      .json({
        success: true,
        credits: user.creditBalance,
        user: { name: user.name },
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, userCredits };
