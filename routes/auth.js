"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { ensureLoggedIn } = require('../middleware/auth');
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    console.log("Received Token Request:", req.body);  // Log the incoming request
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      console.error("Validation Errors:", errs);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    console.log("Authenticated User:", user);  // Log authenticated user
    const token = createToken(user);
    console.log("Generated Token on Login:", token);  // Log the generated token

    // Ensure the response is sent correctly
    return res.json({ token, user });
  } catch (err) {
    console.error("Error in /token route:", err);
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    console.log("Received Registration Request:", req.body);  // Log the incoming request
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      console.error("Validation Errors:", errs);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    console.log("Registered User:", newUser);  // Log the new user data
    const token = createToken(newUser);
    console.log("Generated Token on Register:", token);  // Log the generated token

    // Ensure the response is sent correctly
    return res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error("Error in /register route:", err);
    return next(err);
  }
});

/** GET /auth/currentUser:  => { user }
 *
 * Returns the current user based on the token provided.
 *
 * Authorization required: ensureLoggedIn
 */

router.get("/currentUser", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("Received request for current user with token:", req.headers.authorization);  // Log the token
    const user = await User.get(req.locals.user.username);
    console.log("Current User Data:", user);  // Log the current user data
    return res.json({ user });
  } catch (err) {
    console.error("Error in /currentUser route:", err);
    return next(err);
  }
});

module.exports = router;
