const User = require("../models/User");
class UserController {
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
module.exports = new UserController();
