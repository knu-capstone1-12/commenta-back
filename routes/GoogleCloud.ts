const router = require("../utils/ExternalUtils").router;
const multer = require("../utils/ExternalUtils").multer;
const fs = require("../utils/ExternalUtils").fs;
const path = require("../utils/ExternalUtils").path;
const ffmpeg = require("../utils/ExternalUtils").ffmpeg;
const speech = require("../utils/ExternalUtils").speech;

async function ConnectGCPAPI() {
  const filename = "./uploads/output.wav";
  const audio = {
    content: fs.readFileSync(filename).toString("base64"),
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 48000,
    languageCode: "ko-KR",
  };
  const request = {
    audio: audio,
    config: config,
  };
  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
    return transcription;
  } catch (GCPResException) {
    console.log(GCPResException);
    return "No Credentials or Network Error. Google Cloud API의 인증 정보가 없거나 네트워크 에러입니다.";
  }
}

const client = new speech.SpeechClient();

const upload_Google = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      console.log(file);
      done(null, file.originalname);
    },
    destination(req, file, done) {
      console.log(file);
      done(null, path.join(__dirname, "../uploads"));
    },
  }),
});

router.post("/sttrec", upload_Google.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Please Upload file");
  }
  console.log("====== Incoming Connection (/sttrec) ====");

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, "../uploads", "output.wav");

  ffmpeg()
    .input(inputFilePath)
    .audioFilters("pan=mono|c0=c0,asetrate=48000")
    .audioCodec("pcm_s16le")
    .toFormat("wav")
    .on("end", () => {
      try {
        ConnectGCPAPI().then(function (trans) {
          res.json({ text: trans });
        });
      } catch (e) {
        res.status(500).send("Server Error When calling Google Cloud API");
      }
    })
    .on("error", (err) => {
      console.error("Error during conversion:", err);
      res.status(500).send("Error during conversion");
    })
    .save(outputFilePath);
});

module.exports = router;
