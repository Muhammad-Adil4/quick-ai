// middleware/auth.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Define interface for Clerk user metadata
interface ClerkUserMetadata {
  free_usage?: number;
  plan?: "free" | "premium";
}

// Define UserPlan interface
export interface UserPlan {
  userId: string;
  plan: "free" | "premium";
  freeUsage: number;
}

// Middleware to check user plan and free usage
export const checkUserPlan = async (
  userIdOrReq: string | NextRequest
): Promise<UserPlan> => {
  try {
    let userId: string;

    // Handle both direct userId and NextRequest inputs
    if (typeof userIdOrReq === "string") {
      userId = userIdOrReq;
    } else {
      const authObj = await auth();
      if (!authObj || !authObj.userId) {
        console.error("Auth failed: No authObj or userId", { authObj });
        throw new Error("Unauthorized");
      }
      userId = authObj.userId;
    }

    if (!userId) {
      throw new Error("Unauthorized: No userId provided");
    }

    // Fetch Clerk client and user metadata
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const privateMetadata = (user.privateMetadata || {}) as ClerkUserMetadata;

    // Default values
    let plan: "free" | "premium" = privateMetadata.plan || "free";
    let freeUsage = privateMetadata.free_usage ?? 10;

    // Check for premium plan in publicMetadata or privateMetadata
    const hasPremiumPlan =
      user.publicMetadata?.plan === "premium" || privateMetadata.plan === "premium";
    if (hasPremiumPlan) {
      plan = "premium";
      freeUsage = 0;
    }

    // Restrict access if free plan and no usage left
    if (plan === "free" && freeUsage <= 0) {
      throw new Error("Free usage limit reached. Upgrade to premium.");
    }

    return { userId, plan, freeUsage };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error in checkUserPlan: ${errorMessage}`, error);
    throw new Error(`Failed to check user plan: ${errorMessage}`);
  }
};

// Function to decrement free usage
export const decrementFreeUsage = async (userId: string, freeUsage: number) => {
  try {
    if (freeUsage <= 0) return;
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      privateMetadata: { free_usage: freeUsage - 1 },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error in decrementFreeUsage: ${errorMessage}`, error);
    throw new Error(`Failed to decrement free usage: ${errorMessage}`);
  }
};