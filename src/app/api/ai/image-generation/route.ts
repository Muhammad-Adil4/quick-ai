// src/app/api/ai/generate-image/route.ts
import { checkUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/lib/services/clipdropService";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    // 2️⃣ Check user plan
    const { plan } = await checkUserPlan(userId);
    if (plan !== "premium") {
      return NextResponse.json({
        success: false,
        message: "Premium plan is required for generating images",
      });
    }

    // 3️⃣ Get request body
    const { topic, style } = await req.json();
    if (!topic || !style) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic and style are required for generating image",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Generate image from ClipDrop
    const imageBuffer = await generateImage({ prompt: topic });
    if (!imageBuffer) {
      return NextResponse.json({
        success: false,
        message: "Failed to generate image",
      });
    }

    // 5️⃣ Convert to Node.js Buffer
    const buffer = Buffer.from(imageBuffer);

    // 6️⃣ Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(buffer, `quickai-${Date.now()}`);

    // 7️⃣ Save to Prisma
    const generatedImageData = await prisma.quickAi.create({
      data: {
        userId,
        prompt: `${topic} | ${style}`,
        content: imageUrl,
        type: "image",
        publish: false,
      },
    });

    // 8️⃣ Return response
    return NextResponse.json({
      success: true,
      message: "Image generated successfully",
      generatedImageData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Error:", message, error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
