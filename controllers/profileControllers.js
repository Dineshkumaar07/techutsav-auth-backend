const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { handleError } = require("../util/profileErrorHandler");

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
  const data = req.body;
  const userID = jwt.decode(req.cookies.auth_token);
  Object.keys(data).forEach(
    (element) => data[element] === "" && delete data[element]
  );
  try {
    await User.updateOne({ _id: userID.id }, data)
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
