const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const request = require("request");
const speech = require("@google-cloud/speech");
const OpenAI = require("openai");

module.exports = {
  AWS: AWS,
  multer: multer,
  path: path,
  router: router,
  fs: fs,
  ffmpeg: ffmpeg,
  request: request,
  speech: speech,
  OpenAI: OpenAI,
  dotenv: dotenv,
};
