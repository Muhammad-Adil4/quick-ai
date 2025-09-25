import { checkUserPlan, decrementFreeUsage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Ai from "@/lib/services/geminiService";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
interface RequestBody {
  topic: string;
  category: string;
}
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }
    const { plan, freeUsage } = await checkUserPlan(userId);
    const { topic, category }: RequestBody = await req.json();
    if (!topic || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic and category are required",
        },
        { status: 400 }
      );
    }
    if (plan === "free" && freeUsage > 0) {
      await decrementFreeUsage(userId, freeUsage);
    }
const promptText = `Generate 10 catchy, SEO-optimized blog titles for Topic: "${topic}" and Category: "${category}". Keep each under 60 characters, engaging, unique, and use formats like lists, how-to, questions, or tips. Output as numbered list: 1. Title 1 2. Title 2 ... 10. Title 10. Avoid repeating numbers.`;


    const content = await Ai(promptText);
    if (!content) {
      return NextResponse.json(
        { success: false, message: "Failed to generate article" },
        { status: 500 }
      );
    }
    const blogTitle = await prisma.quickAi.create({
      data: {
        userId,
        prompt: `${topic} | ${category}`,
        content,
        type: "Blog",
        publish: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog generated successfully",
        blogTitle,
        plan,
        freeUsage: plan === "free" ? freeUsage - 1 : freeUsage,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Error:", message, error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
