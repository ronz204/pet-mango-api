-- CreateEnum
CREATE TYPE "mango"."RoomVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "mango"."rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" "mango"."RoomVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "mango"."rooms"("name");
