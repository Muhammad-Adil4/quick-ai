import OpenAI from "openai";

const Ai = async (prompt: string, length: number = 300): Promise<string> => {
  try {
    if (!prompt) throw new Error("Prompt required");

    const openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY, // .env.local me key rakho
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash", // Gemini model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    return response.choices?.[0]?.message?.content ?? "No content generated";
  } catch (error: any) {
    console.error("Gemini AI error:", error.message || error);
    return "Error generating content";
  }
};

export default Ai;
