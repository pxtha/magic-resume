-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Secrets" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserOnGroup" ADD COLUMN     "deletedAt" TIMESTAMP(3);
