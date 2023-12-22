const dotenv = require("dotenv");
dotenv.config();
const router = require("../utils/ExternalUtils").router;
const AWS = require("../utils/ExternalUtils").AWS;
const multer = require("../utils/ExternalUtils").multer;
const path = require("../utils/ExternalUtils").path;
const fs = require("../utils/ExternalUtils").fs;
const ffmpeg = require("../utils/ExternalUtils").ffmpeg;

const upload_AWS = multer({
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
router.post("/sttaws", upload_AWS.single("audio"), (req, res) => {
  require("dotenv").config();
  AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    retryDelayOptions: { base: 300 },
  });
  console.log("====== Incoming Connection (/sttaws) ====");
  const {
    StartTranscriptionJobCommand,
  } = require("@aws-sdk/client-transcribe");
  const {
    DeleteTranscriptionJobCommand,
  } = require("@aws-sdk/client-transcribe");

  const { TranscribeClient } = require("@aws-sdk/client-transcribe");
  const REGION = "ap-northeast-2";
  const transcribeClient = new TranscribeClient({ region: REGION });

  const timestampFilePath = "Timestamp.txt";
  const timestampValue = Date.now().toString();
  fs.writeFileSync(timestampFilePath, timestampValue, "utf-8");

  const rtimestampFilePath = "Timestamp.txt";
  const Timestamp = fs.readFileSync(rtimestampFilePath, "utf-8");

  // Transcribe Input 파라미터 설정(S3 Bucket에서 입력합니다)
  const params = {
    TranscriptionJobName: "DIARY_JOB" + Timestamp,
    LanguageCode: "ko-KR",
    MediaFormat: "wav",
    Media: {
      MediaFileUri:
        "https://capstond-diary.s3.ap-northeast-2.amazonaws.com/record.wav" +
        Timestamp,
    },
    OutputBucketName: "capstond-output",
  };

  const run = async () => {
    try {
      const data = await transcribeClient.send(
        new StartTranscriptionJobCommand(params)
      );
      console.log("Success - put", data.TranscriptionJobSummaries);

      return data;
    } catch (err) {
      console.log("Error", err);
    }
  };

  const del_params = {
    TranscriptionJobName: "DIARY_JOB",
  };
  const delete_run = async () => {
    try {
      const data = await transcribeClient.send(
        new DeleteTranscriptionJobCommand(del_params)
      );
      console.log("Success - deleted");
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  };

  const s3 = new AWS.S3({ maxRetries: 10 });

  if (!req.file) {
    return res.status(400).send("Please Upload file");
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, "../uploads", "output.wav");

  ffmpeg()
    .input(inputFilePath)
    .audioFilters("pan=mono|c0=c0,asetrate=48000")
    .audioCodec("pcm_s16le")
    .toFormat("wav")
    .on("end", () => {
      const AWSfilePath = "./uploads/output.wav";

      const params = {
        Bucket: "capstond-diary",
        Key: "record.wav" + Timestamp,
        Body: fs.createReadStream(AWSfilePath),
      };

      delete_run()
        .then(() => {})
        .then(() => {})
        .then(() => {
          s3.upload(params, (err, data) => {
            if (err) {
              console.error("An Error occured while uploading", err);
            } else {
              console.log("Upload Complete(AWS)", data.Location);
              run();
            }
          });
        });
      setTimeout(() => {
        console.log("DIARY_JOB" + Timestamp + ".json");
        console.log("DIARY_JOB" + Timestamp);
        setTimeout(() => {
          s3.getObject(
            {
              Bucket: "capstond-output",
              Key: "DIARY_JOB" + Timestamp + ".json",
            },
            (err, data) => {
              if (err) {
                console.error("파일을 가져올 수 없습니다:", err);
              } else {
                const jsonContent = data.Body.toString("utf-8"); // JSON 파일 내용을 문자열로 변환

                try {
                  const jsonData = JSON.parse(jsonContent); // JSON 문자열을 JavaScript 객체로 파싱
                  console.log(
                    "JSON 데이터:",
                    jsonData.results.transcripts[0].transcript
                  );
                  res.json({
                    text: jsonData.results.transcripts[0].transcript,
                  });
                  console.log("===== Response Complete =======");
                } catch (parseError) {
                  console.error("Error: JSON 파싱 오류:", parseError);
                  res
                    .status(500)
                    .send("JSON 파싱 오류입니다. 다시 시도해 주세요.");
                }
              }
            }
          );
        }, 10000);
      }, 500);
    })
    .on("error", (err) => {
      console.error("Error during conversion:", err);
      res.status(500).send("Error during conversion");
    })
    .save(outputFilePath);
});

module.exports = router;
