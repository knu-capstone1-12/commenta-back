require("dotenv");
const router = require("../utils/ExternalUtils").router;
const OpenAI = require("../utils/ExternalUtils").OpenAI;

const openaiNormal = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const runPromptNormal = async (UserComment) => {
  try {
    const response = await openaiNormal.chat.completions.create({
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
  } catch (e) {
    console.log("Error: ChatGPT 호출 중 오류");
    return "ChatGPT 호출 중에 오류가 발생하였습니다. 다시 시도해 주세요.";
  }
};

router.post("/gptnormal", async (req, res) => {
  console.log("====== Incoming Connection (/gptnormal) ====");
  console.log("Connecting with API Key: " + process.env.OPENAI_API_KEY);
  let GPTresult = await runPromptNormal(req.body.content);
  res.json({ text: GPTresult });
  console.log("===== Response Complete =======");
});

module.exports = router;
