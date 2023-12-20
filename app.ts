const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const GoogleCloud = require("./routes/GoogleCloud");
const EmotionAnalyze = require("./routes/EmotionAnalyze");
const AmazonTranscribe = require("./routes/AmazonTranscribe");
const GPTAPI = require("./routes/GPTAPI");
const GPTNormalAPI = require("./routes/GPTConnectNormal");
const bodyParser = require("body-parser");
// 필요 모듈 로드 및 router Load

const app = express();
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

app.listen(4000, () => console.log("Waiting on 4000 port."));
