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
var OpenAI = require("../utils/ExternalUtils").OpenAI;
var openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
var analyzetoText = function (UserComment) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "너는 사용자의 감정을 바탕으로 감정 분석을 수행하는 감정 일기 앱의 챗봇이야. 대답할 때에는 토큰 수가 400을 초과하지 않도록 주의해 줘.",
                            },
                            {
                                role: "user",
                                content: "다음 감정을 읽고 감정을 분석하고 사용자에게 조언해줘. 토큰 수는 400이하로 대답해줘. ",
                            },
                            {
                                role: "user",
                                content: UserComment,
                            },
                        ],
                        max_tokens: 400,
                        temperature: 0.2,
                    })];
            case 1:
                response = _a.sent();
                console.log(response.choices);
                return [2 /*return*/, response.choices[0].message.content];
            case 2:
                e_1 = _a.sent();
                console.log("Error: ChatGPT 호출 중에 오류 발생");
                return [2 /*return*/, "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요."];
            case 3: return [2 /*return*/];
        }
    });
}); };
var analyzetoScoreCalc = function (UserComment) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "너는 사용자의 감정을 바탕으로 감정 분석을 수행하는 감정 일기 앱의 챗봇이야. 대답할 때는 감정에 대한 긍정, 부정 점수를 반환하게 될거야. 점수는 -3과 3사이여야 하고, 강한 부정은 -3, 강한 긍정은 3점이야. 대답할 때는 다른 어떤 텍스트도 넣지 말고 숫자로만 대답해줘.",
                            },
                            {
                                role: "user",
                                content: "다음 감정을 읽고 감정을 분석하고 감정 점수를 계산해줘. 대답할 때는 그 어떤 텍스트도 넣지 말고 정확한 숫자로만 대답해줘. 예를 들면 '3', '2.7', '-0.15'와 같은 방식으로 대답해.",
                            },
                            {
                                role: "user",
                                content: "어떤 텍스트도 말하지 말고 숫자만을 말해야 한다는 사실을 명심해. '%d'형식으로 대답해. 숫자 앞에 :나 Caption을 붙이지 마.",
                            },
                            {
                                role: "user",
                                content: UserComment,
                            },
                        ],
                        max_tokens: 400,
                        temperature: 0.2,
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.choices[0].message.content];
            case 2:
                e_2 = _a.sent();
                console.log("Error: ChatGPT 호출 중에 오류 발생");
                return [2 /*return*/, "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요."];
            case 3: return [2 /*return*/];
        }
    });
}); };
router.post("/gptanalyze", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var GPTresult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("====== Incoming Connection (/gptanalyze) ====");
                console.log("Connecting with API Key: " + process.env.OPENAI_API_KEY);
                return [4 /*yield*/, analyzetoText(req.body.content)];
            case 1:
                GPTresult = _a.sent();
                res.json({ text: GPTresult });
                console.log("===== Response Complete =======");
                return [2 /*return*/];
        }
    });
}); });
router.post("/gptscore", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var GPTScoreResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("====== Incoming Connection (/gptscore) ====");
                console.log("Connecting with API Key: " + process.env.OPENAI_API_KEY);
                return [4 /*yield*/, analyzetoScoreCalc(req.body.content)];
            case 1:
                GPTScoreResult = _a.sent();
                console.log("Analyzed Score: " + parseInt(GPTScoreResult));
                res.json({ emotionScore: parseInt(GPTScoreResult) });
                console.log("===== Response Complete =======");
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
