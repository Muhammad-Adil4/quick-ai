import axios from "axios";

interface GenerateImageProps {
  prompt: string;
}

export const generateImage = async ({ prompt }: GenerateImageProps) => {
  try {
    const form = new FormData();
    form.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form, // body
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY || "",
        },
        responseType: "arraybuffer", // important for binary data
      }
    );

    if (!response || !response.data) {
      throw new Error("Image generation failed");
    }

    return response.data; // this is ArrayBuffer
  } catch (error) {
    console.error("generateImage Error:", error);
    throw error;
  }
};
