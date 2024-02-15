/*
  Warnings:

  - You are about to drop the column `productID` on the `carts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `productID` ON `carts`;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `productID`,
    ADD COLUMN `product_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role_id` INTEGER NOT NULL DEFAULT 2;

-- CreateIndex
CREATE INDEX `product_id` ON `carts`(`product_id`);
