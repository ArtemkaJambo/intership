/*
  Warnings:

  - Changed the type of `entityType` on the `userActions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EntityTypes" AS ENUM ('User', 'Post', 'Comment', 'PostLike', 'CommentLike', 'Viewed', 'Followed', 'NewFollower');

-- AlterTable
ALTER TABLE "userActions" DROP COLUMN "entityType",
ADD COLUMN     "entityType" "EntityTypes" NOT NULL;

-- DropEnum
DROP TYPE "entityTypes";
