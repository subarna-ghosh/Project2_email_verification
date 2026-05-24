const transporter = require("../config/emailconfig");
const OtpModel = require("../models/Otp");
const crypto = require("crypto");

const sendEmail = async (req, user) => {
  // Generate a random 6-digit number
  const otp = crypto.randomInt(100000, 999999);

  // Save OTP in Database
  const gg = await new OtpModel({ userId: user._id, otp: otp }).save();
  console.log("otp", gg);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP - Verify your account",
    text: "",
    html: `
<div style="
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 40px 20px;
">

    <div style="
        max-width: 500px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">

        <!-- Header -->
        <div style="
            background-color: #1657a6;
            color: white;
            padding: 20px;
            text-align: center;
        ">
            <h1 style="margin: 0; font-size: 24px;">
                Email Verification
            </h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #333;">

            <p style="font-size: 16px;">
                Dear <strong>${user.name}</strong>,
            </p>

            <p style="
                font-size: 15px;
                line-height: 1.6;
            ">
                Thank you for signing up with our website.
                Please use the OTP below to verify your email address.
            </p>

            <!-- OTP Box -->
            <div style="
                margin: 30px 0;
                text-align: center;
            ">

                <div style="
                    display: inline-block;
                    background-color: #f8f8f8;
                    border: 2px dashed #1657a6;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 5px;
                    color: #1657a6;
                ">
                    ${otp}
                </div>

            </div>

            <p style="
                font-size: 14px;
                color: #666;
                line-height: 1.6;
            ">
                This OTP is valid for
                <strong>15 minutes</strong>.
            </p>

            <p style="
                font-size: 14px;
                color: #666;
                line-height: 1.6;
            ">
                If you did not request this email,
                please ignore it.
            </p>

        </div>

        <!-- Footer -->
        <div style="
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
        ">
            © 2026 Your Company. All rights reserved.
        </div>

    </div>

</div>
`,
  });

  return otp;
};

module.exports = sendEmail;
