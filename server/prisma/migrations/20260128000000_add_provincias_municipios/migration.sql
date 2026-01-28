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

-- Add new columns to negocios
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

-- Update existing negocios to have default provincia/municipio if they exist
-- This is a temporary fix - in production you should migrate existing data properly
UPDATE `negocios` 
SET `provinciaId` = (SELECT id FROM `provincias` LIMIT 1),
    `municipioId` = (SELECT id FROM `municipios` LIMIT 1)
WHERE `provinciaId` IS NULL OR `municipioId` IS NULL;

-- Make columns NOT NULL after setting defaults
ALTER TABLE `negocios` MODIFY COLUMN `provinciaId` INTEGER NOT NULL;
ALTER TABLE `negocios` MODIFY COLUMN `municipioId` INTEGER NOT NULL;

