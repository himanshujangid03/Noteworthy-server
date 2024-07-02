/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
// eslint-disable-next-line node/no-unpublished-require
const helmet = require("helmet");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const noteRouter = require("./router/notesRouter");
const userRouter = require("./router/userRouter");
const taskRouter = require("./router/taskRouter");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request on this IP address. Try again in an hour",
});

app.use("/", limiter);

app.use(
  cors({
    credentials: true,
    //origin: "https://noteworthy-zeta.vercel.app",
    origin: "https://noteworthy2.vercel.app/",
  }),
);

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
);

app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

  res.json(tokens);
});

app.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken,
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "cross-origin-embedder-policy": "'require-corp'",
      "cross-origin-opener-policy": "'same-origin'",
    },
  }),
);
app.use("/", (req, res, next) => {
  next();
});

app.use("/note", noteRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.use(globalErrorHandler);
module.exports = app;
