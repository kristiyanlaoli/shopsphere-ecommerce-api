/*
  Warnings:

  - Added the required column `origin_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `carts` ADD COLUMN `origin_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `origin_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `city_id` INTEGER NOT NULL,
    MODIFY `image` VARCHAR(191) NOT NULL DEFAULT 'https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1-180x180.png';
