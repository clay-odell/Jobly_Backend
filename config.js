"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
const DB_PORT = +process.env.DB_PORT || 5432;
console.log(`PORT: ${PORT}`);
console.log(`DB_PORT: ${DB_PORT}`);

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql:///jobly_test"
    : process.env.DATABASE_URL || "postgresql:///jobly";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("DB_PORT:".yellow, DB_PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  DB_PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri
};
