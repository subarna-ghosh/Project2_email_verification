const User = require("../models/User");
class AdminController {
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
      const id = req.params.id;
      const data = await User.findById(id).select("-password");
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
}
module.exports = new AdminController();
