const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }
      const isExist = await User.findOne({ email });
      if (isExist) {
        if (isExist.isVerified) {
          return res.status(400).json({
            success: false,
            message: "user already exist!",
          });
        }
        return res.status(400).json({
          success: false,
          message: "user already exist but not verified!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      const createUser = new User({
        name,
        email,
        password: hashedPass,
      });
      const userData = await createUser.save();
      await sendEmail(req, userData);
      return res.status(200).json({
        success: true,
        message:
          "User registered successfully and otp has been sent to your mail!",
        userData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }
      let isPresent = await User.findOne({ email });
      if (!isPresent) {
        return res.status(400).json({
          success: false,
          message: "user is not registerd!",
        });
      }
      if (isPresent.isVerified) {
        return res.status(400).json({
          success: false,
          message: "user already verified!",
        });
      }
      const otpVerify = await Otp.findOne({ userId: isPresent._id });
      if (!otpVerify) {
        return res.status(400).json({
          success: false,
          message: "email verification did not match!",
        });
      }
      const currentTime = new Date();
      const expirationTime = new Date(
        otpVerify.createdAt.getTime() + 15 * 60 * 1000,
      );

      if (currentTime > expirationTime) {
        await otpVerify.deleteMany({
          userId: isPresent._id,
        });
        return res.status(400).json({
          success: false,
          message: "OTP expired. Please request new OTP",
        });
      }

      if (otpVerify.otp !== otp) {
        otpVerify.attempts += 1;
        await otpVerify.save();

        if (otpVerify.attempts >= 5) {
          await Otp.deleteMany({ userId: isPresent._id });
          return res.status(400).json({
            success: false,
            message: "Too many incorrect attempts",
          });
        }

        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${5 - otpVerify.attempts} attempts left`,
        });
      }

      isPresent.isVerified = true;
      await isPresent.save();
      await Otp.deleteMany({ userId: isPresent._id });
      return res.status(200).json({
        success: true,
        message: "user verified successfully!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async resend(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "field is needed!",
        });
      }
      const isExist = await User.findOne({ email });
      if (!isExist) {
        return res.status(400).json({
          success: false,
          message: "user is not present!",
        });
      }
      if (isExist.isVerified) {
        return res.status(400).json({
          success: false,
          message: "user is already verified!",
        });
      }
      const otpPresent = await Otp.findOne({ userId: isExist._id });
      if (otpPresent) {
        const currentTime = new Date();
        const sentTime = new Date(otpPresent.createdAt.getTime());
        const diff = currentTime - sentTime;
        //6s cooldown
        if (diff < 60 * 1000) {
          return res.status(400).json({
            success: false,
            message: "Please wait 60 seconds before requesting another OTP",
          });
        }
        await Otp.deleteMany({ userId: isExist._id });
      }
      await sendEmail(req, isExist);
      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }
      const isPresent = await User.findOne({ email });
      if (!isPresent) {
        return res.status(400).json({
          success: false,
          message: "user is not registered!",
        });
      }
      const isMatch = await bcrypt.compare(password, isPresent.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "password did not match!",
        });
      }
      if (!isPresent.isVerified) {
        return res.status(400).json({
          success: false,
          message: "user is not verified!",
        });
      }
      const token = jwt.sign(
        {
          id: isPresent._id,
          name: isPresent.name,
          email: isPresent.email,
          role: isPresent.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );
      return res.status(200).json({
        success: true,
        message: "token generated successfully!",
        token,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const data = await User.find({ role: "user" }).select("-password");
      return res.status(200).json({
        success: true,
        message: "fetched all users!",
        count: data.length,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async viewUser(req, res) {
    try {
      const id=req.params.id;
      const data=await User.findById(id).select("-password");
      return res.status(200).json({
        success: true,
        message: "fetched particular user's profile!",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async userProfile(req, res) {
    try {
      const id = req.user.id;
      const user = await User.findById(id).select("-password");
      return res.status(200).json({
        success: true,
        message: "user fetched profile!",
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new AuthController();
