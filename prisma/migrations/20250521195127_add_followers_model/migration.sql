-- CreateTable
CREATE TABLE "Followers" (
    "id" SERIAL NOT NULL,
    "followedId" INTEGER NOT NULL,
    "followerId" INTEGER NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Followers_followedId_followerId_key" ON "Followers"("followedId", "followerId");

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
