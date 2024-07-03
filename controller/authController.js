const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// eslint-disable-next-line
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

//* create token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const cookieOptions = {
    path: "/",
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//* sign up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser, 201, res);
  next();
});

//* login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 500));
  }

  createSendToken(user, 201, res);
});

//* check is logged in
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.user;
    return next();
  }
  if (req.cookies.jwt || req.isAuthenticated()) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError("User does not exist!"));
    }
    req.user = currentUser;
    return next();
  }
  next();
});

//* logout
exports.logout = catchAsync(async (req, res, next) => {
  //res.clearCookie("jwt");
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  };

  res.cookie("jwt", "", cookieOptions);
  res.redirect("https://noteworthy-app.vercel.app");
  next();
});

//* get user
exports.getUserName = catchAsync(async (req, res, next) => {
  const { name, email, picture, mode } = req.user;
  const data = { name, email, picture, mode };

  res.status(201).json(data);
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with such email address.", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host",
  )}/user/resetPassword/${resetToken}`;

  const message = `Forgot yout password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your email then please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(201).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error in sending the email. Please try again later.",
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
