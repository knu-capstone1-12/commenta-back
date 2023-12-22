"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var express = require("express");
var GoogleCloud = require("./routes/GoogleCloud");
var EmotionAnalyze = require("./routes/EmotionAnalyze");
var AmazonTranscribe = require("./routes/AmazonTranscribe");
var GPTAPI = require("./routes/GPTAPI");
var GPTNormalAPI = require("./routes/GPTConnectNormal");
var bodyParser = require("body-parser");
// 필요 모듈 로드 및 router Load
var app = express();
// Body Parser 로드
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 각 Entrypoint별 연동 Set
app.post("/sttrec", GoogleCloud);
app.post("/senceemotion", EmotionAnalyze);
app.post("/sttaws", AmazonTranscribe);
app.post("/gptanalyze", GPTAPI);
app.post("/gptscore", GPTAPI);
app.post("/gptnormal", GPTNormalAPI);
app.listen(4000, function () { return console.log("Waiting on 4000 port."); });
