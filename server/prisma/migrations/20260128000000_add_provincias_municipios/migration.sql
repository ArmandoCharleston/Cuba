-- CreateTable
CREATE TABLE IF NOT EXISTS `provincias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `provincias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `municipios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `provinciaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `municipios_nombre_provinciaId_key`(`nombre`, `provinciaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add new columns to negocios (nullable initially)
ALTER TABLE `negocios` ADD COLUMN IF NOT EXISTS `provinciaId` INTEGER NULL;
ALTER TABLE `negocios` ADD COLUMN IF NOT EXISTS `municipioId` INTEGER NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS `negocios_provinciaId_idx` ON `negocios`(`provinciaId`);
CREATE INDEX IF NOT EXISTS `negocios_municipioId_idx` ON `negocios`(`municipioId`);
CREATE INDEX IF NOT EXISTS `municipios_provinciaId_idx` ON `municipios`(`provinciaId`);

-- AddForeignKey
ALTER TABLE `municipios` ADD CONSTRAINT IF NOT EXISTS `municipios_provinciaId_fkey` FOREIGN KEY (`provinciaId`) REFERENCES `provincias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `negocios` ADD CONSTRAINT IF NOT EXISTS `negocios_provinciaId_fkey` FOREIGN KEY (`provinciaId`) REFERENCES `provincias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `negocios` ADD CONSTRAINT IF NOT EXISTS `negocios_municipioId_fkey` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Update chats table to support new chat types
-- Make clienteId, empresaId, negocioId nullable
ALTER TABLE `chats` MODIFY COLUMN `clienteId` INTEGER NULL;
ALTER TABLE `chats` MODIFY COLUMN `empresaId` INTEGER NULL;
ALTER TABLE `chats` MODIFY COLUMN `negocioId` INTEGER NULL;

-- Add new columns for admin support
ALTER TABLE `chats` ADD COLUMN IF NOT EXISTS `adminId` INTEGER NULL;
ALTER TABLE `chats` ADD COLUMN IF NOT EXISTS `tipo` VARCHAR(191) NOT NULL DEFAULT 'cliente-empresa';
ALTER TABLE `chats` ADD COLUMN IF NOT EXISTS `noLeidosAdmin` INTEGER NOT NULL DEFAULT 0;

-- Create index for adminId
CREATE INDEX IF NOT EXISTS `chats_adminId_idx` ON `chats`(`adminId`);

-- AddForeignKey for admin
ALTER TABLE `chats` ADD CONSTRAINT IF NOT EXISTS `chats_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: We don't drop the unique constraint here because it might be needed
-- The constraint will be handled by Prisma's db push if needed
-- For now, we just make the columns nullable and add the new fields
