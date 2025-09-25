// app/api/generate-article/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Ai from "@/lib/services/geminiService";
import { checkUserPlan, decrementFreeUsage } from "@/lib/auth";

// Interface for request body
interface RequestBody {
  topic: string;
  length: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get userId from token
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    // 2️⃣ Check user plan and free usage
    const { plan, freeUsage } = await checkUserPlan(userId);

    // 3️⃣ Get request body
    const { topic, length }: RequestBody = await req.json();
    if (!topic || !length) {
      return NextResponse.json(
        { success: false, message: "Topic and length are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Decrement free usage for free plan users
    if (plan === "free" && freeUsage > 0) {
      await decrementFreeUsage(userId, freeUsage);
    }

    // 5️⃣ Generate AI content
    const promptText = `Write a detailed article about "${topic}" with approximately ${length} words.`;
    const content = await Ai(promptText, length);
    if (!content) {
      return NextResponse.json(
        { success: false, message: "Failed to generate article" },
        { status: 500 }
      );
    }

    // 6️⃣ Save article to Prisma
    const quickAi = await prisma.quickAi.create({
      data: {
        userId,
        prompt: topic,
        content,
        type: "article",
        publish: false,
      },
    });

    // 7️⃣ Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Article generated successfully",
        article: quickAi,
        plan,
        freeUsage: plan === "free" ? freeUsage - 1 : freeUsage,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Error:", message, error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
