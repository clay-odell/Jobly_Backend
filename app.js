"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");

const app = express();

app.use(cors({ origin: "https://your-frontend-url.com", credentials: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRoutes);
app.use("/companies", authenticateJWT, companiesRoutes);
app.use("/users", authenticateJWT, usersRoutes);
app.use("/jobs", authenticateJWT, jobsRoutes);

console.log("Routes set up...");

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

console.log("Express app initialized...");
module.exports = app;
