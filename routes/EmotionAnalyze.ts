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
      "X-NCP-APIGW-API-KEY": process.env.NCPKEY,
    },
    body: {
      content: req.body.content,
    },
    json: true,
  };

  request.post(options, function (error, response, body) {
    console.log(
      "Confidence of Document(Body of Response): " +
        JSON.stringify(response.body.document.confidence)
    );
    const jsonBody = response.body.document;
    var emotionScore;
    if (jsonBody.sentiment == "positive") {
      emotionScore =
        jsonBody.confidence.positive - jsonBody.confidence.negative;
    } else if (jsonBody.sentiment == "negative") {
      emotionScore =
        jsonBody.confidence.positive - jsonBody.confidence.negative;
    } else {
      emotionScore = 0;
    } // 긍정 점수에서 부정 점수를 감산하여 총 점수를 계산하는 부분
    res.json({ emotionScore: emotionScore });
    console.log("Emotion Score: " + emotionScore);
    console.log("===== Response Complete =======");
  });
});

module.exports = router_Emotion;
