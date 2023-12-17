var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv");
const GPTNormalrouter = require("express").Router();
const OpenAINormal = require("openai");
const openaiNormal = new OpenAINormal({
    apiKey: process.env.OPENAI_API_KEY,
});
const runPromptNormal = (UserComment) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield openaiNormal.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "다음 질문에 대해 400토큰 이하로 대답해줘.",
                },
                {
                    role: "user",
                    content: UserComment,
                },
            ],
            max_tokens: 300,
            temperature: 0.2,
        });
        console.log(response.choices);
        return response.choices[0].message.content;
    }
    catch (e) {
        console.log("Error: ChatGPT 호출 중 오류");
        return "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요.";
    }
});
GPTNormalrouter.post("/gptnormal", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("====== Incoming Connection (/gptnormal) ====");
    console.log("Connecting with API Key: " + process.env.OPENAI_API_KEY);
    let GPTresult = yield runPromptNormal(req.body.content);
    res.json({ text: GPTresult });
    console.log("===== Response Complete =======");
}));
module.exports = GPTNormalrouter;
