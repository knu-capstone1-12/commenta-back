"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var router = require("../utils/ExternalUtils").router;
var AWS = require("../utils/ExternalUtils").AWS;
var multer = require("../utils/ExternalUtils").multer;
var path = require("../utils/ExternalUtils").path;
var fs = require("../utils/ExternalUtils").fs;
var ffmpeg = require("../utils/ExternalUtils").ffmpeg;
var upload_AWS = multer({
    storage: multer.diskStorage({
        filename: function (req, file, done) {
            console.log(file);
            done(null, file.originalname);
        },
        destination: function (req, file, done) {
            console.log(file);
            done(null, path.join(__dirname, "../uploads"));
        },
    }),
});
router.post("/sttaws", upload_AWS.single("audio"), function (req, res) {
    require("dotenv").config();
    AWS.config.update({
        region: process.env.REGION,
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        retryDelayOptions: { base: 300 },
    });
    console.log("====== Incoming Connection (/sttaws) ====");
    var StartTranscriptionJobCommand = require("@aws-sdk/client-transcribe").StartTranscriptionJobCommand;
    var DeleteTranscriptionJobCommand = require("@aws-sdk/client-transcribe").DeleteTranscriptionJobCommand;
    var TranscribeClient = require("@aws-sdk/client-transcribe").TranscribeClient;
    var REGION = "ap-northeast-2";
    var transcribeClient = new TranscribeClient({ region: REGION });
    var timestampFilePath = "Timestamp.txt";
    var timestampValue = Date.now().toString();
    fs.writeFileSync(timestampFilePath, timestampValue, "utf-8");
    var rtimestampFilePath = "Timestamp.txt";
    var Timestamp = fs.readFileSync(rtimestampFilePath, "utf-8");
    // Transcribe Input 파라미터 설정(S3 Bucket에서 입력합니다)
    var params = {
        TranscriptionJobName: "DIARY_JOB" + Timestamp,
        LanguageCode: "ko-KR",
        MediaFormat: "wav",
        Media: {
            MediaFileUri: "https://capstond-diary.s3.ap-northeast-2.amazonaws.com/record.wav" +
                Timestamp,
        },
        OutputBucketName: "capstond-output",
    };
    var run = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, transcribeClient.send(new StartTranscriptionJobCommand(params))];
                case 1:
                    data = _a.sent();
                    console.log("Success - put", data.TranscriptionJobSummaries);
                    return [2 /*return*/, data];
                case 2:
                    err_1 = _a.sent();
                    console.log("Error", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var del_params = {
        TranscriptionJobName: "DIARY_JOB",
    };
    var delete_run = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, transcribeClient.send(new DeleteTranscriptionJobCommand(del_params))];
                case 1:
                    data = _a.sent();
                    console.log("Success - deleted");
                    return [2 /*return*/, data]; // For unit tests.
                case 2:
                    err_2 = _a.sent();
                    console.log("Error", err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var s3 = new AWS.S3({ maxRetries: 10 });
    if (!req.file) {
        return res.status(400).send("Please Upload file");
    }
    var inputFilePath = req.file.path;
    var outputFilePath = path.join(__dirname, "../uploads", "output.wav");
    ffmpeg()
        .input(inputFilePath)
        .audioFilters("pan=mono|c0=c0,asetrate=48000")
        .audioCodec("pcm_s16le")
        .toFormat("wav")
        .on("end", function () {
        var AWSfilePath = "./uploads/output.wav";
        var params = {
            Bucket: "capstond-diary",
            Key: "record.wav" + Timestamp,
            Body: fs.createReadStream(AWSfilePath),
        };
        delete_run()
            .then(function () { })
            .then(function () { })
            .then(function () {
            s3.upload(params, function (err, data) {
                if (err) {
                    console.error("An Error occured while uploading", err);
                }
                else {
                    console.log("Upload Complete(AWS)", data.Location);
                    run();
                }
            });
        });
        setTimeout(function () {
            console.log("DIARY_JOB" + Timestamp + ".json");
            console.log("DIARY_JOB" + Timestamp);
            setTimeout(function () {
                s3.getObject({
                    Bucket: "capstond-output",
                    Key: "DIARY_JOB" + Timestamp + ".json",
                }, function (err, data) {
                    if (err) {
                        console.error("파일을 가져올 수 없습니다:", err);
                    }
                    else {
                        var jsonContent = data.Body.toString("utf-8"); // JSON 파일 내용을 문자열로 변환
                        try {
                            var jsonData = JSON.parse(jsonContent); // JSON 문자열을 JavaScript 객체로 파싱
                            console.log("JSON 데이터:", jsonData.results.transcripts[0].transcript);
                            res.json({
                                text: jsonData.results.transcripts[0].transcript,
                            });
                            console.log("===== Response Complete =======");
                        }
                        catch (parseError) {
                            console.error("Error: JSON 파싱 오류:", parseError);
                            res
                                .status(500)
                                .send("JSON 파싱 오류입니다. 다시 시도해 주세요.");
                        }
                    }
                });
            }, 10000);
        }, 500);
    })
        .on("error", function (err) {
        console.error("Error during conversion:", err);
        res.status(500).send("Error during conversion");
    })
        .save(outputFilePath);
});
module.exports = router;
