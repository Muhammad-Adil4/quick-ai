import { checkUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeImageBackgroundObject } from "@/lib/services/remove-object";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    // 2️⃣ Plan Check
    const { plan } = await checkUserPlan(userId);
    if (plan !== "premium") {
      return NextResponse.json({
        success: false,
        message: "Premium plan is required for generating images",
      });
    }

    // 3️⃣ FormData Validation
    const formData = await req.formData();
    const image = formData.get("image");
    const promptValue = formData.get("prompt");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 }
      );
    }
    if (!promptValue || typeof promptValue !== "string") {
      return NextResponse.json(
        { success: false, message: "Prompt text is required" },
        { status: 400 }
      );
    }

    const prompt = promptValue;

    // 4️⃣ Convert Blob → Buffer
    const bufferData = Buffer.from(await image.arrayBuffer());

    // 5️⃣ Remove Image Background
    const resultBuffer = await removeImageBackgroundObject({
      image: bufferData,
      prompt,
    });

    if (!resultBuffer) {
      return NextResponse.json({
        success: false,
        message: "Failed to remove background of image",
      });
    }

    // 6️⃣ Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(
      resultBuffer,
      `quickai-${Date.now()}`
    );

    // 7️⃣ Save record in DB
    const savedRecord = await prisma.quickAi.create({
      data: {
        userId,
        prompt: "Removing background of Image",
        content: imageUrl,
        type: "removeBackgroundOfImage",
        publish: false,
      },
    });

    // 8️⃣ Return response
    return NextResponse.json({
      success: true,
      message: "Background removed successfully",
      savedRecord,
      imageUrl,
    });

  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("API Error:", message);

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
