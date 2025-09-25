// src/app/api/ai/Resume-Review/route.ts
export const runtime = "nodejs";

import { checkUserPlan } from "@/lib/auth";
import Ai from "@/lib/services/geminiService";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Plan Check
    const { plan } = await checkUserPlan(userId);
    if (plan !== "premium") {
      return NextResponse.json({
        success: false,
        message: "Premium plan required for resume review",
      });
    }

    // 3️⃣ FormData & File Validation
    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    if (!resumeFile || !(resumeFile instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "Resume file is required" },
        { status: 400 }
      );
    }

    // 4️⃣ File Size Validation
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (resumeFile.size > maxFileSize) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // 5️⃣ Convert Blob → Buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6️⃣ Extract Text (dynamic imports to avoid build-time evaluation)
    let resumeText = "";
    const mimeType = (resumeFile as Blob).type;

    if (mimeType === "application/pdf") {
      // dynamically import pdf-parse
      try {
        const pdfParseModule = await import("pdf-parse");
        const pdfParse = (pdfParseModule && (pdfParseModule.default || pdfParseModule)) as (
          buf: Buffer
        ) => Promise<{ text: string }>;
        const data = await pdfParse(buffer);
        resumeText = data.text ?? "";
      } catch (e) {
        console.error("Error loading/using pdf-parse:", e);
        return NextResponse.json(
          { success: false, message: "Failed to parse PDF resume" },
          { status: 500 }
        );
      }
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // dynamically import mammoth
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value ?? "";
      } catch (e) {
        console.error("Error loading/using mammoth:", e);
        return NextResponse.json(
          { success: false, message: "Failed to parse DOCX resume" },
          { status: 500 }
        );
      }
    } else if (mimeType === "text/plain") {
      resumeText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported resume format" },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Resume file is empty" },
        { status: 400 }
      );
    }

    // 7️⃣ Sanitize Resume Text
    resumeText = resumeText.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    // 8️⃣ Generate AI prompt
    const prompt = `Please act as an expert HR and career coach. Review the following resume and provide detailed feedback in these areas:
1. Overall structure and formatting
2. Clarity and readability
3. Strengths and key skills
4. Areas for improvement
5. Suggestions to make it more appealing to recruiters

Resume Content:
${resumeText}`;

    // 9️⃣ Call Gemini AI
    const review = await Ai(prompt, 800);
    if (!review || typeof review !== "string" || review.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to generate resume review" },
        { status: 500 }
      );
    }

    const resumedata = await prisma.quickAi.create({
      data: {
        userId,
        prompt: `Review of uploaded resume`,
        content: review.trim(),
        type: "ResumeReview",
        publish: false,
      },
    });

    // 🔟 Return Response
    return NextResponse.json({
      success: true,
      message: "Resume review generated and saved successfully",
      resumedata,
    });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("Resume Review API Error:", message, err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
