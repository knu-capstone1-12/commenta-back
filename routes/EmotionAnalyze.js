// app.post("/senceemotion", (req, res) => {
//   require("dotenv").config();
//   console.log("====== Incoming Connection (/senceemotion) ====");
//   console.log("JSON Request Body: " + JSON.stringify(req.body));
//   const options = {
//     uri: "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-NCP-APIGW-API-KEY-ID": process.env.NCPID,
//       "X-NCP-APIGW-API-KEY": process.env.NCPKEY,
//     },
//     body: {
//       content: req.body.content,
//     },
//     json: true,
//   };

//   request.post(options, function (error, response, body) {
//     console.log(
//       "Confidence of Document(Body of Response): " +
//         JSON.stringify(response.body.document.confidence)
//     );
//     res.json(response.body.document.confidence);
//     console.log("===== Response Complete =======");
//   });
// });

const router_Emotion = require("express").Router();
const request = require("request");

router_Emotion.post("/senceemotion", (req, res) => {
  require("dotenv").config();
  console.log("====== Incoming Connection (/senceemotion) ====");
  console.log("JSON Request Body: " + JSON.stringify(req.body));
  const options = {
    uri: "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NCP-APIGW-API-KEY-ID": process.env.NCPID,
      "X-NCP-APIGW-API-KEY": process.env.NCPKEY
    },
    body: {
      content: req.body.content
    },
    json: true
  };

  request.post(options, function (error, response, body) {
    console.log("Confidence of Document(Body of Response): " + JSON.stringify(response.body.document.confidence));
    const jsonBody = response.body.document;
    var emotionScore;
    if (jsonBody.sentiment == "positive") {
      emotionScore = 1;
      emotionScore = emotionScore + (jsonBody.confidence.positive - jsonBody.confidence.negative) / 50;
    } else if (jsonBody.sentiment == "negative") {
      emotionScore = -1;
      emotionScore = emotionScore + (jsonBody.confidence.positive - jsonBody.confidence.negative) / 50;
    } else {
      emotionScore = 0;
    } //(1 | 0 | -1) + 2*(긍정 - 부정)
    res.json({ emotionScore: emotionScore });
    console.log("Emotion Score: " + emotionScore);
    console.log("===== Response Complete =======");
  });
});

module.exports = router_Emotion;
