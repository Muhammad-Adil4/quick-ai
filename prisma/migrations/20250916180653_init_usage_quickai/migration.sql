-- CreateTable
CREATE TABLE "public"."Usage" (
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "plan" TEXT NOT NULL DEFAULT 'free',

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("userId")
);
