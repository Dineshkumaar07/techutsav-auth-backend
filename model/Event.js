const mongoose = require("mongoose");

const event = new mongoose.Schema({
  uniqueName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: "",
  },
  eventName: {
    type: String,
    default: "",
  },
  eventTiming: {
    type: String,
    default: "",
  },
  eventAbstract: {
    type: String,
    default: "",
  },
  eventDesp: {
    type: String,
    default: "",
  },
  flagship: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model("event", event);
module.exports = Event;
