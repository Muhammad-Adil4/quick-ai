import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Ai from '@/lib/services/geminiService';
import { getUserPlan } from '@/lib/clerk';

const FREE_USAGE_LIMIT = process.env.FREE_USAGE_LIMIT
  ? parseInt(process.env.FREE_USAGE_LIMIT, 10)
  : 10;

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get userId from token
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    // 2️⃣ Get request body
    const { topic, length }: { topic: string; length: number } = await req.json();
    if (!topic || !length) {
      return NextResponse.json(
        { error: 'Topic and length are required' },
        { status: 400 }
      );
    }

    // 3️⃣ Get user plan from Clerk
    const plan = await getUserPlan(userId);

    // 4️⃣ Usage tracking
    let usage = await prisma.usage.findUnique({ where: { userId } });

    if (!usage) {
      // Create usage record if not exists
      usage = await prisma.usage.create({ data: { userId, count: 0, plan } });
    } else if (usage.plan !== plan) {
      // Update plan if Clerk plan changed
      usage = await prisma.usage.update({
        where: { userId },
        data: { plan },
      });
    }

    // 5️⃣ Check free usage limit
    if (usage.plan === 'free' && usage.count >= FREE_USAGE_LIMIT) {
      return NextResponse.json(
        {
          error: 'Free usage limit reached. Upgrade to premium.',
          freeUsage: usage.count,
          plan: usage.plan,
        },
        { status: 403 }
      );
    }

    // 6️⃣ Increment usage for free users
    if (usage.plan === 'free') {
      usage = await prisma.usage.update({
        where: { userId },
        data: { count: usage.count + 1 },
      });
    }

    // 7️⃣ Generate AI content
    const promptText = `Write a detailed article about "${topic}" with approximately ${length} words.`;
    const content = await Ai(promptText, length);

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate article' },
        { status: 500 }
      );
    }

    // 8️⃣ Save article
    const quickAi = await prisma.quickAi.create({
      data: {
        userId,
        prompt: topic,
        content,
        type: 'article',
        publish: false,
      },
    });

    // 9️⃣ Response
    return NextResponse.json({
      quickAi,
      freeUsage: usage.plan === 'free' ? usage.count : null,
      plan: usage.plan,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
      return NextResponse.json(
        { error: 'Internal Server Error', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown API Error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', details: 'Unknown error' },
        { status: 500 }
      );
    }
  }
}