-- AlterTable
-- Change avatar column from VARCHAR(191) to TEXT to support longer values (base64 images, long URLs, etc.)
ALTER TABLE `users` MODIFY COLUMN `avatar` TEXT NULL;

