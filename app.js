const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");
const dotenv = require("dotenv");
const noteRouter = require("./router/notesRouter");
const folderRouter = require("./router/folderRouter");
const userRouter = require("./router/userRouter");
const taskRouter = require("./router/taskRouter");
const activityRouter = require("./router/activityRouter");
const globalErrorHandler = require("./controller/errorController");
const User = require("./model/userModel");

const app = express();

dotenv.config({ path: "./config.env" });

app.use(express.json());

//* sessions

app.use(cookieParser());
/* 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request on this IP address. Try again in an hour",
});
 */
/* app.use("/", limiter); */

app.use(
  cors({
    credentials: true,
    //origin: "https://noteworthy2.vercel.app",
    origin: "https://noteworthy-app.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  }),
);

//* session setup
app.use(passport.initialize());
app.use(passport.session());

//* google signin route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

//* after google sign in redirect to home page
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "https://noteworthy-app.vercel.app",
    failureRedirect: `https://noteworthy-app.vercel.app/login`,
  }),
);

//* google logout
app.get("/user/google/logout", (req, res, next) => {
  req.logout(() => {
    console.log("logged out from google");
  });
  res.redirect("https://noteworthy-app.vercel.app");
});

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://noteworthy-server-latest.onrender.com/auth/google/secrets",
      userProfileURL: "http://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile.email });
        cb(null, user);

        if (!user) {
          const newUser = await User.create({
            name: profile.name.displayName,
            email: profile.email,
            password: profile.id,
            picture: profile.picture,
            mode: "google",
          });
          cb(null, newUser);
        }
      } catch (err) {
        cb(err);
      }
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.use("/note", noteRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);
app.use("/activity", activityRouter);
app.use("/folder", folderRouter);

app.use(globalErrorHandler);
module.exports = app;
