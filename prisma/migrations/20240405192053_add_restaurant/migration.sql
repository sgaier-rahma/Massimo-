/*
  Warnings:

  - Added the required column `restSlug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "restSlug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_restSlug_fkey" FOREIGN KEY ("restSlug") REFERENCES "Restaurant"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
