const request = require("supertest"),
  express = require("express"),
  { expect } = require("chai");
const dotenv = require("dotenv");
dotenv.config();
const GoogleCloud = require("../routes/GoogleCloud");
const EmotionAnalyze = require("../routes/EmotionAnalyze");
const AmazonTranscribe = require("../routes/AmazonTranscribe");
const GPTAPI = require("../routes/GPTAPI");
const GPTNormalAPI = require("../routes/GPTConnectNormal");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/sttrec", GoogleCloud);
app.post("/senceemotion", EmotionAnalyze);
app.post("/sttaws", AmazonTranscribe);
app.post("/gptanalyze", GPTAPI);
app.post("/gptscore", GPTAPI);
app.post("/gptnormal", GPTNormalAPI);

describe("POST /gptanalyze_good", () => {
  it("responds with json", (done) => {
    request(app)
      .post("/gptanalyze")
      .set("Content-Type", "application/json")
      .send({ content: "오늘은 너무 기쁜 날이야." })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        console.log(res.body.text);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  }).timeout(15000);
});

describe("POST /gptanalyze_sad", () => {
  it("responds with json", (done) => {
    request(app)
      .post("/gptanalyze")
      .set("Content-Type", "application/json")
      .send({ content: "오늘은 너무 슬픈 날이었어. 교수님께 혼나고 왔어." })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        console.log(res.body.text);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  }).timeout(15000);
});

describe("POST /gptnormal_test", () => {
  it("responds with json", (done) => {
    request(app)
      .post("/gptnormal")
      .set("Content-Type", "application/json")
      .send({ content: "GPT-3모델에 대해 설명해줘." })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        console.log(res.body.text);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  }).timeout(15000);
});

describe("POST /gptscore_sad", () => {
  it("responds with json", (done) => {
    request(app)
      .post("/gptscore")
      .set("Content-Type", "application/json")
      .send({ content: "오늘은 너무 슬픈 날이었어. 교수님께 혼나고 왔어." })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        console.log(res.body);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  }).timeout(15000);
});

describe("POST /gptscore_good", () => {
  it("responds with json", (done) => {
    request(app)
      .post("/gptscore")
      .set("Content-Type", "application/json")
      .send({ content: "오늘은 너무 기쁜 날이야." })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        console.log(res.body);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  }).timeout(15000);
});
