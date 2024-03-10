const User = require("../model/User");
const Event = require("../model/Event");
const jwt = require("jsonwebtoken");
const { handleError } = require("../util/profileErrorHandler");
// const emailjs = require("@emailjs/nodejs");

module.exports.profile_get = (req, res) => {
  const userID = jwt.decode(req.cookies.auth_token);
  try {
    User.find({ _id: userID.id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        const errors = handleError("DB Error", "db");
        res.status(400).json({ errors });
      });
  } catch (err) {
    console.log(err);
    const errors = handleError("DB Error", "db");
    res.status(400).json({ errors });
  }
};

module.exports.addEvents_put = async (req, res) => {
  const { eventName } = req.body;
  const userID = jwt.decode(req.cookies.auth_token);

  try {
    await User.updateOne(
      { _id: userID.id },
      { $push: { eventsRegistered: eventName } }
    )
      .then((result) => {
        res.status(200).json({ msg: "success" });
      })
      .catch((err) => {
        const errors = handleError("Failed to Update", "db");
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleError("Failed to Update", "db");
    res.status(400).json({ errors });
  }
};

module.exports.unRegisterEvents_put = async (req, res) => {
  const { eventName } = req.body;
  const userID = jwt.decode(req.cookies.auth_token);

  try {
    await User.updateOne(
      { _id: userID.id },
      { $pull: { eventsRegistered: eventName } }
    )
      .then((result) => {
        res.status(200).json({ msg: "success" });
      })
      .catch((err) => {
        const errors = handleError("Failed to Update", "db");
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleError("Failed to Update", "db");
    res.status(400).json({ errors });
  }
};

module.exports.updateProfile_put = async (req, res) => {
  const { transactionNumber, fullName, email, selectedDepartment } = req.body;
  const userID = jwt.decode(req.cookies.auth_token);
  try {
    await User.updateOne(
      { _id: userID.id },
      {
        transactionNumber: transactionNumber,
        selectedDepartment: selectedDepartment,
      }
    )
      .then(async (result) => {
        var params = {
          to_name: fullName,
          to_mail: email,
          main_message:
            "Thank you for completing the Payment Process. Your Payment has been successfully sent for verification to the Administrator. You will get an reply from the Admin within 36 Hours. If you didn't receive any Mail within the time period then please use the contact details provided in the Website for further communications.\nRegards, Team TechUtsav24.",
        };
        // console.log(params);
        const options = {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
          },
        };
        await fetch("https://mail-service-faef.onrender.com/sendMail", options)
          .then((output) => {
            // res.cookie("auth_token", token, {
            //   maxAge: maxAge * 1000,
            //   httpOnly: true,
            //   sameSite: "none",
            // });
            // res.status(201).json({ msg: result._id });
            res.status(200).json({ msg: "success" });
          })
          .catch((err) => {
            res.status(400).json({ msg: "error" });
          });
        // emailjs
        //   .send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, params, {
        //     publicKey: process.env.PUBLIC_KEY,
        //     privateKey: process.env.PRIVATE_KEY,
        //   })
        //   .then((result) => {
        //     // console.log(result);
        //     // console.log("Email Sent!");
        //   })
        //   .catch((err) => {
        //     // console.log(err);
        //   });
      })
      .catch((err) => {
        const errors = handleError("Failed to Update", "db");
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleError("Failed to Update", "db");
    res.status(400).json({ errors });
  }
};

module.exports.getEvents_post = async (req, res) => {
  const { departmentName } = req.body;
  console.log(departmentName);
  Event.find({ department: departmentName })
    .then((result) => {
      res.status(400).json(result);
    })
    .catch((err) => {
      const errors = handleError("Data Not Found", "db");
      res.status(400).json({ errors });
    });
};
