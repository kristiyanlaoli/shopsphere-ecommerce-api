/*
  Warnings:

  - You are about to drop the column `origin_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `carts` DROP COLUMN `origin_id`;

-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `seller_id`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipping_cost` DOUBLE NULL;
