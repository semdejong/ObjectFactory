require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const express = require("express");

const { User, validate } = require("../models/user");
const Session = require("../models/Session");

const { authenticate } = require("./middleware/authenticate");

const router = express.Router();

router.post("/register", async (req, res) => {
  //Email is the unique identifier for the user
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(403).json({ message: "This email already exists." });

  //Validate the user data
  const { error } = validate(req.body);
  if (error) return res.status(403).json({ message: error.details[0].message });

  //Hash the password using bcrypt https://www.npmjs.com/package/bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const apiKey = uuidv4();

  //Hashing the api key using bcrypt
  const saltForAPi = await bcrypt.genSalt(10);
  const hashedApiKey = await bcrypt.hash(apiKey, saltForAPi);

  try {
    //Create a new user based on the model and save it to the database
    const uploadedUser = await new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      APIKey: hashedApiKey,
    }).save();

    //Return the user without a password and with a success code
    return res.status(200).json({ ...uploadedUser, password: "" });
  } catch (err) {
    //Return an error if the user could not be created
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(403)
        .json({ message: "These credentials are not valid." });

    //Check if the password is correct for the user with the given email, return early if not
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(403)
        .json({ message: "These credentials are not valid." });

    // //Delete all sessions for the user (unslahs to disable multi device login, this way users will only be able to login on one device at a time)
    // await Session.deleteMany({ user: user._id });

    //Create a new session for the user based on a uuid
    const sessionToken = uuidv4();

    //Create a new session for the user based on the model and saving it to the database
    await new Session({
      user: user._id,
      sessionToken: sessionToken,
    }).save();

    //TODO: implement 2fa
    const expireDate = new Date(new Date().getTime() + 24 * 60 * 60000);
    if (!req.body.isMobile) {
      //Calculating the expiration date for the session (24hrs)

      //Adding a cookie to the response with the sessionToken
      res.cookie("session", sessionToken, {
        sameSite: "strict",
        path: "/",
        expires: expireDate,
        httpOnly: true,
      });
    }

    //Returning the response obj with a success code
    return res
      .status(200)
      .json({
        message: "Session cookie has been set.",
        expiryDate: expireDate,
        username: user.username,
        fullname: user.fullname,
        sessionToken: sessionToken,
        roles: user.roles,
      })
      .send();
  } catch (err) {
    //Return an error if the user could not be logged in
    return res.status(500).json({ message: err.message });
  }
});

router.get("/logout", authenticate(), async (req, res) => {
  //Getting the cookie from the request (httpCookies)
  const cookie = req.cookies.session;

  //Deleting the cookie from the response object
  res.clearCookie("session");
  res.clearCookie("isAuth");

  try {
    //Deleting the session from the database
    await Session.findOneAndDelete({ sessionToken: cookie });
  } catch (err) {
    //Return an error if the session could not be deleted
  }
  //Returning a succes message with its respective code
  return res.status(200).json({ message: "You have successfully logged out" });
});

router.post("/apikey", authenticate(), async (req, res) => {
  //Getting the user from the request
  const user = req.user;

  //Generating a new api key for the user
  const apiKey = uuidv4();

  //Hashing the api key using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedApiKey = await bcrypt.hash(apiKey, salt);

  //Updating the user with the new api key
  user.APIKey = hashedApiKey;

  //Saving the user to the database
  await user.save();

  //Returning the api key with a success code
  return res.status(200).json({ apiKey: apiKey + "#" + user._id });
});

module.exports = router;
