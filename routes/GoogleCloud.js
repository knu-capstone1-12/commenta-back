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
var router = require("../utils/ExternalUtils").router;
var multer = require("../utils/ExternalUtils").multer;
var fs = require("../utils/ExternalUtils").fs;
var path = require("../utils/ExternalUtils").path;
var ffmpeg = require("../utils/ExternalUtils").ffmpeg;
var speech = require("../utils/ExternalUtils").speech;
function ConnectGCPAPI() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, audio, config, request, response, transcription, GCPResException_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = "./uploads/output.wav";
                    audio = {
                        content: fs.readFileSync(filename).toString("base64"),
                    };
                    config = {
                        encoding: "LINEAR16",
                        sampleRateHertz: 48000,
                        languageCode: "ko-KR",
                    };
                    request = {
                        audio: audio,
                        config: config,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.recognize(request)];
                case 2:
                    response = (_a.sent())[0];
                    transcription = response.results
                        .map(function (result) { return result.alternatives[0].transcript; })
                        .join("\n");
                    console.log("Transcription: ".concat(transcription));
                    return [2 /*return*/, transcription];
                case 3:
                    GCPResException_1 = _a.sent();
                    console.log(GCPResException_1);
                    return [2 /*return*/, "No Credentials or Network Error. Google Cloud API의 인증 정보가 없거나 네트워크 에러입니다."];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var client = new speech.SpeechClient();
var upload_Google = multer({
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
router.post("/sttrec", upload_Google.single("audio"), function (req, res) {
    if (!req.file) {
        return res.status(400).send("Please Upload file");
    }
    console.log("====== Incoming Connection (/sttrec) ====");
    var inputFilePath = req.file.path;
    var outputFilePath = path.join(__dirname, "../uploads", "output.wav");
    ffmpeg()
        .input(inputFilePath)
        .audioFilters("pan=mono|c0=c0,asetrate=48000")
        .audioCodec("pcm_s16le")
        .toFormat("wav")
        .on("end", function () {
        try {
            ConnectGCPAPI().then(function (trans) {
                res.json({ text: trans });
            });
        }
        catch (e) {
            res.status(500).send("Server Error When calling Google Cloud API");
        }
    })
        .on("error", function (err) {
        console.error("Error during conversion:", err);
        res.status(500).send("Error during conversion");
    })
        .save(outputFilePath);
});
module.exports = router;
