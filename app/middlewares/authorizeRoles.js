const authorizeRoles = (...roles) => {
  const checkRole = (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        message: "Access denied!",
      });
    }
    next();
  };
  return checkRole;
};
module.exports = authorizeRoles;
