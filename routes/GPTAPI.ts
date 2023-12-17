const dotenvGPT = require("dotenv");
dotenvGPT.config();
const GPTrouter = require("express").Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runPrompt = async (UserComment: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 사용자의 감정을 바탕으로 감정 분석을 수행하는 감정 일기 앱의 챗봇이야. 대답할 때에는 토큰 수가 400을 초과하지 않도록 주의해 줘.",
        },
        {
          role: "user",
          content:
            "다음 감정을 읽고 감정을 분석하고 사용자에게 조언해줘. 토큰 수는 400이하로 대답해줘. ",
        },
        {
          role: "user",
          content: UserComment,
        },
      ],
      max_tokens: 400,
      temperature: 0.2,
    });
    console.log(response.choices);
    return response.choices[0].message.content;
  } catch (e) {
    console.log("Error: ChatGPT 호출 중에 오류 발생");
    return "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요.";
  }
};

GPTrouter.post("/gptanalyze", async (req, res) => {
  console.log("====== Incoming Connection (/gptanalyze) ====");
  console.log("Connecting with API Key: " + process.env.OPENAI_API_KEY);
  let GPTresult = await runPrompt(req.body.content);
  res.json({ text: GPTresult });
  console.log("===== Response Complete =======");
});

module.exports = GPTrouter;
