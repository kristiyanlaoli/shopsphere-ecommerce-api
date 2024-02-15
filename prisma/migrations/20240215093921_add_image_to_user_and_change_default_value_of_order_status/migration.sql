-- AlterTable
ALTER TABLE `orders` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Unpaid';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `image` VARCHAR(191) NULL;
