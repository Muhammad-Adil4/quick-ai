import { checkUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeBackground } from "@/lib/services/removeBackground";
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
    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const bufferdata = Buffer.from(arrayBuffer);
    const resultBuffer = await removeBackground(bufferdata);
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

    const removeBackgroundImagedata = await prisma.quickAi.create({
      data: {
        userId,
        prompt: `Remove Background from Image`,
        content: imageUrl,
        type: "removeBackgroundofImage",
        publish: false,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Background removed successfully",
      removeBackgroundImagedata,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Error:", message, error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
