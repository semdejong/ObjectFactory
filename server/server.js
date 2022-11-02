require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const { initializeSocketService } = require("./socket/initializeSocketService");

const app = express();

const port_number = process.env.PORT || 3001;

console.log(
  `Connecting to MongoDB at ${process.env.DATABASE_URL}`,
  process.env.NODE_ENV
);

mongoose.connect(
  process.env.DATABASE_URL || "mongodb://localhost/objectfactory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connection established"));

const whitelistNA = process.env.ORIGIN;
const whitelist = whitelistNA?.split(",") || [];
whitelist.push("http://localhost:3001/");
whitelist.push("http://13.40.35.21:8080");

app.use(
  cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS" + origin));
      }
    },
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../client/build")));

if (process.env.NODE_ENV !== "production") {
  app.use(async (req, res, next) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1200);
    next();
  });
}

//Socket.io
const socket = initializeSocketService(3002);

app.use(async (req, res, next) => {
  req.socket = socket;
  next();
});

//Add routes
const testRouter = require("./routes/test");
app.use("/api/test", testRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const userRouter = require("./routes/user.js");
app.use("/api/user", userRouter);

const roleRoute = require("./routes/role");
app.use("/api/role", roleRoute);

const objectTypeRoute = require("./routes/objectType");
app.use("/api/objectType", objectTypeRoute);

const objectRoute = require("./routes/object");
app.use("/api/object", objectRoute);

const fileRoute = require("./routes/file");
app.use("/api/file", fileRoute);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(port_number, () =>
  console.log("Server listening on port " + port_number)
);
