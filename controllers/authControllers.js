const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { handleError } = require("../util/authErrorHandler");
// const emailjs = require("@emailjs/nodejs");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: maxAge });
};

module.exports.email_check_post = async (req, res) => {
  const { email } = req.body;
  try {
    User.find({ email })
      .then((result) => {
        if (result.length === 0) {
          res.status(200).json({ msg: "success" });
        } else {
          res.status(400).json({ msg: "Exists" });
        }
      })
      .catch((err) => {
        const errors = handleError(err);
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.signup_post = async (req, res) => {
  const {
    email,
    fullName,
    password,
    phoneNumber,
    collegeName,
    department,
    transactionNumber,
    selectedDepartment,
  } = req.body;
  try {
    await User.create({
      email,
      fullName,
      password,
      phoneNumber,
      collegeName,
      department,
      transactionNumber,
      selectedDepartment,
    }).then(async (result) => {
      const token = createToken({ user: result._id });
      var params = {
        to_name: fullName,
        to_mail: email,
        main_message:
          "Thank you for completing the Payment Process. Your Payment has been successfully sent for verification to the Administrator. You will get an reply from the Admin within 36 Hours. If you didn't receive any Mail within the time period then please use the contact details provided in the Website for further communications.\nRegards, Team TechUtsav24.",
      };
      // console.log(params);
      // emailjs
      //   .send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, params, {
      //     publicKey: process.env.PUBLIC_KEY,
      //     privateKey: process.env.PRIVATE_KEY,
      //   })
      //   .then((output) => {
      //     // console.log(result);
      //     // console.log("Email Sent!");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     res.status(400).json({ msg: "error" });
      //   });
      const options = {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch("https://mail-service-faef.onrender.com/sendMail", options)
        .then((output) => {
          res.cookie("auth_token", token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
            sameSite: "none",
          });
          res.status(201).json({ msg: result._id });
        })
        .catch((err) => {
          res.status(400).json({ msg: "error" });
        });
    });
  } catch (err) {
    // console.log(err);
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("auth_token", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ msg: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("auth_token", "", {
    maxAge: 1,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ msg: "success" });
};
