/*
  Warnings:

  - The primary key for the `UserOnGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserOnGroup` table. All the data in the column will be lost.
  - Added the required column `email` to the `UserOnGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_userId_fkey";

-- AlterTable
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_pkey",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD CONSTRAINT "UserOnGroup_pkey" PRIMARY KEY ("email", "groupId");

-- AddForeignKey
ALTER TABLE "UserOnGroup" ADD CONSTRAINT "UserOnGroup_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
