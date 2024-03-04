const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Empty"],
    unique: true,
    validate: [isEmail, "Invalid Email"],
    lowercase: true,
  },
  fullName: {
    type: String,
    required: [true, "Full Name is Empty"],
    minLength: [2, "Length must be atleast 2 Characters"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone is Empty"],
    minLength: [10, "Length is Not 10 Characters"],
    maxLength: [10, "Length is Not 10 Characters"]
  },
  collegeName: {
    type: String,
    required: [true, "College Name is Required"],
    minLength: [2, "Length must be atleast 2 Categories"],
  },
  department: {
    type: String,
    required: [true, "Department Name is Required"],
    minLength: [2, "Length must be atleast 2 Characters"],
  },
  paid: {
    type: Boolean,
    default: false,
  },
  transactionNumber: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minLength: [6, "Length must be atleast 6 Characters"],
  },
  selectedDepartment: {
    type: String,
    default: ""
  }
});

userSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcryptjs.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Invalid Email");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
