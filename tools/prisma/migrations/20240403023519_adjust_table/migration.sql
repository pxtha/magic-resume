/*
  Warnings:

  - The primary key for the `UserOnGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `UserOnGroup` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_email_fkey";

-- AlterTable
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserOnGroup_pkey" PRIMARY KEY ("id");
