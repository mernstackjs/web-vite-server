const express = require("express");
const authentication = require("./authentication");
const post = require("./post");

const router = express.Router();

module.exports = () => {
  authentication(router);
  post(router);

  return router;
};
