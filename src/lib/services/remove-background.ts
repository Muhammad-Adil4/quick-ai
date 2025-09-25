import axios from "axios";

export const removeBackground = async (photo: Buffer): Promise<Buffer> => {
  const formData = new FormData();
  formData.append(
    "image_file",
    new Blob([new Uint8Array(photo)], { type: "image/jpeg" }),
    "image.jpg"
  );

  const response = await axios.post(
    "https://clipdrop-api.co/remove-background/v1",
    formData,
    {
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY || "",
      },
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(response.data);
};
