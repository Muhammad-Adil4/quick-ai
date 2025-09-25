import cloudinary from "./cloudinary";

export const uploadToCloudinary = async (buffer: Buffer, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: fileName, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url); // Cloudinary image URL
      }
    );
    stream.end(buffer); // pipe the buffer
  });
};
