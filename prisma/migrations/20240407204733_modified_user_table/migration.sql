/*
  Warnings:

  - Added the required column `ownerID` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "ownerID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
