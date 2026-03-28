-- CreateEnum
CREATE TYPE "mango"."MemberRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "mango"."members" (
    "id" SERIAL NOT NULL,
    "role" "mango"."MemberRole" NOT NULL DEFAULT 'USER',
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_userId_roomId_key" ON "mango"."members"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "mango"."members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "mango"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mango"."members" ADD CONSTRAINT "members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "mango"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
