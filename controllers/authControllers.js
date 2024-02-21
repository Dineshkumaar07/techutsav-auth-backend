const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { handleError } = require("../util/errorHandler");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: maxAge });
};

module.exports.signup_post = async (req, res) => {
  const { email, fullName, password, phoneNumber, collegeName, department } =
    req.body;
  try {
    const user = await User.create({
      email,
      fullName,
      password,
      phoneNumber,
      collegeName,
      department,
    });
    const token = createToken({ user: user._id });
    res.cookie("auth_token", token, { maxAge: maxAge * 1000 });
    res.status(201).json({ msg: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("auth_token", token, { maxAge: maxAge * 1000 });
    res.status(200).json({ msg: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("auth_token", "", { maxAge: 1 });
  res.status(200).json({ msg: "success" });
};
