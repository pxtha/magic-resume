-- DropForeignKey
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_groupId_fkey";

-- AddForeignKey
ALTER TABLE "UserOnGroup" ADD CONSTRAINT "UserOnGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
