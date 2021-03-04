const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: true, credentials: true }));

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https:", "http:", "data:", "ws:"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "http:", "data:"],
      scriptSrc: ["'self'", "https:", "http:", "blob:"],
      styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
    },
  })
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later!",
});
app.use("/", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xssClean());
// Prevent parameter pollution
app.use(hpp());

app.use("/posts", postRouter);
app.use("/users", userRouter);

app.use(globalErrorHandler);
module.exports = app;
