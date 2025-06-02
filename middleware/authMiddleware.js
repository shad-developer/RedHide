const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protected = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
  const user = await userModel.findById(verified.user).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  req.user = user;
  next();
};

const isAdmin =async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Not authorized! Only Admins can access this route" });
    throw new Error("Not authorized! Only Admins can access this route");
  }
};

module.exports = { protected, isAdmin };
