require("dotenv");
const GPTNormalrouter = require("express").Router();
const OpenAINormal = require("openai");

const openaiNormal = new OpenAINormal({
  apiKey: process.env.OPENAI_API_KEY,
});

const runPromptNormal = async (UserComment) => {
  try {
    const response = await openaiNormal.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 사용자의 감정을 바탕으로 감정 분석을 수행하는 감정 일기 앱의 챗봇이야.",
        },
        {
          role: "user",
          content: "다음 감정을 읽고 감정을 분석하고 사용자에게 조언해줘.",
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
  } catch (e) {
    console.log("ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요.");
    return "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요.";
  }
};

GPTNormalrouter.post("/gptanalyze", async (req, res) => {
  console.log(process.env.OPENAI_API_KEY);
  let GPTresult = await runPrompt(req.body.content);
  res.json({ text: GPTresult });
});

module.exports = GPTrouter;
