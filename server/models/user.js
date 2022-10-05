const mongoose = require("mongoose");

const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    min: 2,
    max: 100,
    required: true,
  },
  email: {
    type: String,
    min: 5,
    max: 255,
    required: true,
  },
  password: {
    type: String,
    min: 5,
    max: 1000,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  phoneNumber: {
    type: String,
    min: 4,
    max: 20,
    required: false,
  },
  APIKey: {
    type: String,
    min: 5,
    max: 1000,
    required: false,
    unique: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

function validateUser(user) {
  const schema = Joi.object({
    fullname: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(255).required(),
    password: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
  });
  return schema.validate(user);
  //   return Joi.validate(user, schema);
}

module.exports.User =
  mongoose.models.User || mongoose.model("User", userSchema);
module.exports.validate = validateUser;
