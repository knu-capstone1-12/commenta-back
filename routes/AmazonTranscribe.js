var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
app.post("/sttaws", upload.single("audio"), (req, res) => {
    require("dotenv").config();
    const { StartTranscriptionJobCommand, } = require("@aws-sdk/client-transcribe");
    const { DeleteTranscriptionJobCommand, } = require("@aws-sdk/client-transcribe");
    const { GetTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
    const { TranscribeClient } = require("@aws-sdk/client-transcribe");
    const REGION = "ap-northeast-2";
    const transcribeClient = new TranscribeClient({ region: REGION });
    const timestampFilePath = "Timestamp.txt";
    const timestampValue = Date.now().toString(); // 원하는 값을 사용
    fs.writeFileSync(timestampFilePath, timestampValue, "utf-8");
    const rtimestampFilePath = "Timestamp.txt";
    const Timestamp = fs.readFileSync(rtimestampFilePath, "utf-8");
    // Transcribe Input 파라미터 설정(S3 Bucket에서 입력합니다)
    const params = {
        TranscriptionJobName: "DIARY_JOB" + Timestamp,
        LanguageCode: "ko-KR",
        MediaFormat: "wav",
        Media: {
            MediaFileUri: "https://capstond-diary.s3.ap-northeast-2.amazonaws.com/record.wav" +
                Timestamp,
        },
        OutputBucketName: "capstond-output",
    };
    const run = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield transcribeClient.send(new StartTranscriptionJobCommand(params));
            console.log("Success - put", data.TranscriptionJobSummaries);
            return data; // For unit tests.
        }
        catch (err) {
            console.log("Error", err);
        }
    });
    const del_params = {
        TranscriptionJobName: "DIARY_JOB",
    };
    const delete_run = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield transcribeClient.send(new DeleteTranscriptionJobCommand(del_params));
            console.log("Success - deleted");
            return data; // For unit tests.
        }
        catch (err) {
            console.log("Error", err);
        }
    });
    AWS.config.update({
        region: process.env.REGION,
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        retryDelayOptions: { base: 300 },
    });
    const s3 = new AWS.S3({ maxRetries: 10 });
    if (!req.file) {
        return res.status(400).send("Please Upload file");
    }
    const inputFilePath = req.file.path;
    const outputFilePath = path.join(__dirname, "uploads", "output.wav");
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
            .then(() => { })
            .then(() => { })
            .then(() => {
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error("An Error occured while uploading", err);
                }
                else {
                    console.log("Upload Complete(AWS)", data.Location);
                    run();
                }
            });
        });
        setTimeout(() => {
            console.log("DIARY_JOB" + Timestamp + ".json");
            console.log("DIARY_JOB" + Timestamp);
            setTimeout(() => {
                s3.getObject({
                    Bucket: "capstond-output",
                    Key: "DIARY_JOB" + Timestamp + ".json",
                }, (err, data) => {
                    if (err) {
                        console.error("파일을 가져올 수 없습니다:", err);
                    }
                    else {
                        const jsonContent = data.Body.toString("utf-8"); // JSON 파일 내용을 문자열로 변환
                        try {
                            const jsonData = JSON.parse(jsonContent); // JSON 문자열을 JavaScript 객체로 파싱
                            console.log("JSON 데이터:", jsonData.results.transcripts[0].transcript);
                            res.json({
                                text: jsonData.results.transcripts[0].transcript,
                            });
                        }
                        catch (parseError) {
                            console.error("JSON 파싱 오류:", parseError);
                            res.status(500).send("JSON parse Error");
                        }
                    }
                });
            }, 10000);
        }, 500);
    })
        .on("error", (err) => {
        console.error("Error during conversion:", err);
        res.status(500).send("Error during conversion");
    })
        .save(outputFilePath);
});
