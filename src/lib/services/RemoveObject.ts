import axios from "axios";

interface RemoveImageData {
  image: Buffer;
  prompt: string;
}

export const removeImageBackgroundObject = async ({
  image,
  prompt,
}: RemoveImageData): Promise<Buffer> => {
  try {
    const formData = new FormData();
    formData.append(
      "image_file",
      new Blob([image], { type: "image/jpeg" }),
      "image.jpg"
    );
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/replace-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY || "",
          // Content-Type set automatically by FormData
        },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (error: any) {
    console.error("ClipDrop API Error:", error.message || error);
    throw new Error("Failed to replace background");
  }
};
