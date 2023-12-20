"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var router = require("express").Router();
var AWS = require("aws-sdk");
var multer = require("multer");
var path = require("path");
var fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");
var request = require("request");
var speech = require("@google-cloud/speech");
var OpenAI = require("openai");
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
