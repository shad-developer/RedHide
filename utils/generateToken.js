const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN, {
    expiresIn: "10d",
  });
  res.cookie("token", accessToken, {
    maxAge: 10 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "strict",
  });

  return accessToken;
};

module.exports = generateToken;
