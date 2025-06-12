-- CreateEnum
CREATE TYPE "entityTypes" AS ENUM ('User', 'Post', 'Comment', 'PostLike', 'CommentLike');

-- CreateTable
CREATE TABLE "userActions" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "entityType" "entityTypes" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entity" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userActions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userActions" ADD CONSTRAINT "userActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
