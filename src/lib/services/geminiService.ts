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
  } catch (err: unknown) {
    // Handle unknown instead of any
    let message = "Error generating content";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("Gemini AI error:", message);
    return message;
  }
};

export default Ai;
