const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const os = require("os");
const GoogleCloud = require("./routes/GoogleCloud");
const EmotionAnalyze = require("./routes/EmotionAnalyze");
const AmazonTranscribe = require("./routes/AmazonTranscribe");
const GPTAPI = require("./routes/GPTAPI");
const GPTNormalAPI = require("./routes/GPTConnectNormal");
const bodyParser = require("body-parser");
// 필요 모듈 로드 및 router Load

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sttrec", GoogleCloud);
app.post("/senceemotion", EmotionAnalyze);
app.post("/sttaws", AmazonTranscribe);
app.post("/gptanalyze", GPTAPI);
app.post("/gptscore", GPTAPI);
app.post("/gptnormal", GPTNormalAPI);

app.listen(4000, () => console.log("Waiting on 4000 port."));
