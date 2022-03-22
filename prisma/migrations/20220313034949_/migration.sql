-- DropForeignKey
ALTER TABLE "MemberOnTask" DROP CONSTRAINT "MemberOnTask_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberOnTask" DROP CONSTRAINT "MemberOnTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_teamId_fkey";

-- DropForeignKey
ALTER TABLE "PairOnMember" DROP CONSTRAINT "PairOnMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "PairOnMember" DROP CONSTRAINT "PairOnMember_pairId_fkey";

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnTask" ADD CONSTRAINT "MemberOnTask_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnTask" ADD CONSTRAINT "MemberOnTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairOnMember" ADD CONSTRAINT "PairOnMember_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairOnMember" ADD CONSTRAINT "PairOnMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Member.email_unique" RENAME TO "Member_email_key";
