/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("categoryname") ON DELETE RESTRICT ON UPDATE CASCADE;
