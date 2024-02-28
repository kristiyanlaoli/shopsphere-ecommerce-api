/*
  Warnings:

  - Added the required column `seller_id` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `seller_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipping_cost` DOUBLE NOT NULL DEFAULT 0;
