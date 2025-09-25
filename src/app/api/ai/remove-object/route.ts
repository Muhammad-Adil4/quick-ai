import { checkUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeImageBackgroundObject } from "@/lib/services/remove-object";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }
    const { plan } = await checkUserPlan(userId);
    if (plan !== "premium") {
      return NextResponse.json({
        success: false,
        message: "Premium plan is required for generating images",
      });
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const promptValue = formData.get("prompt");

    if (
      !image ||
      !(image instanceof Blob) ||
      !promptValue ||
      typeof promptValue !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "image and prompt are required for removeBackground",
        },
        { status: 400 }
      );
    }
    const prompt = promptValue;
    const bufferdata = Buffer.from(await image.arrayBuffer());
    const resultBuffer = await removeImageBackgroundObject({
      image: bufferdata,
      prompt,
    });
    if (!resultBuffer) {
      return NextResponse.json({
        success: false,
        message: "Failed to remove background of image",
      });
    }
    const imageUrl = await uploadToCloudinary(
      resultBuffer,
      `quickai-${Date.now()}`
    );
   const savedRecord = await prisma.quickAi.create({
      data: {
        userId,
        prompt: "Removing background of Image",
        content: imageUrl,
        type: "removeBackgroundOfImage",
        publish: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Background removed successfully",
      savedRecord,
      imageUrl,
    });

  } catch (error: any) {
    console.error("API Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
