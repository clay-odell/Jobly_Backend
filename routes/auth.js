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
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    console.log("Generated Token:", token);  // Ensure the token is generated correctly
    console.log("Authenticated User:", user);  // Log authenticated user
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
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    console.log("Generated Token on Register:", token);  // Log generated token on register
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
    const user = await User.get(req.locals.user.username);
    console.log("Res.JSON user: ", res.json({ user }));
    return res.json({ user });
  } catch (err) {
    console.error("Error in /currentUser route:", err);
    return next(err);
  }
});

module.exports = router;
