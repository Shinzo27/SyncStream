/*
  Warnings:

  - You are about to drop the column `roomId` on the `RoomParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomName,userId]` on the table `RoomParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomName` to the `RoomParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_roomId_fkey";

-- DropIndex
DROP INDEX "RoomParticipant_roomId_userId_key";

-- AlterTable
ALTER TABLE "RoomParticipant" DROP COLUMN "roomId",
ADD COLUMN     "roomName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_roomName_userId_key" ON "RoomParticipant"("roomName", "userId");

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
