-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
