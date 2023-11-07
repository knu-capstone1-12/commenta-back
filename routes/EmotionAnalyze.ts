app.post("/senceemotion", (req, res) => {
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
    res.json(response.body.document.confidence);
    console.log("===== Response Complete =======");
  });
});
