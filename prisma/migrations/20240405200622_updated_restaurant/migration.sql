/*
  Warnings:

  - Added the required column `address` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "town" TEXT NOT NULL;
