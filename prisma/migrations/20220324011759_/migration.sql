/*
  Warnings:

  - The primary key for the `MemberOnTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `PairOnMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SomeData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pairId` to the `Member` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `MemberOnTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PairOnMember" DROP CONSTRAINT "PairOnMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "PairOnMember" DROP CONSTRAINT "PairOnMember_pairId_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "pairId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MemberOnTask" DROP CONSTRAINT "MemberOnTask_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "MemberOnTask_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "PairOnMember";

-- DropTable
DROP TABLE "SomeData";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
