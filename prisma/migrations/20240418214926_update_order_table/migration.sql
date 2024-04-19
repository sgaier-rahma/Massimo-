/*
  Warnings:

  - Added the required column `orderType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderType" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
