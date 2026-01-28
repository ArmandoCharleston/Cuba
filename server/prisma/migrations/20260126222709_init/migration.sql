-- CreateTable
CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `ciudad` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `rol` ENUM('cliente', 'empresa', 'admin') NOT NULL DEFAULT 'cliente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `icono` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categorias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `ciudades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ciudades_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `negocios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `foto` VARCHAR(191) NULL,
    `categoriaId` INTEGER NOT NULL,
    `ciudadId` INTEGER NOT NULL,
    `propietarioId` INTEGER NOT NULL,
    `estado` ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    `calificacion` DOUBLE NOT NULL DEFAULT 0,
    `totalResenas` INTEGER NOT NULL DEFAULT 0,
    `precioPromedio` DOUBLE NOT NULL DEFAULT 0,
    `horarios` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `negocio_fotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `negocioId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `negocioId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DOUBLE NOT NULL,
    `duracion` INTEGER NOT NULL,
    `categoria` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `reservas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `estado` ENUM('pendiente', 'confirmada', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
    `precioTotal` DOUBLE NOT NULL,
    `notas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `noLeidosCliente` INTEGER NOT NULL DEFAULT 0,
    `noLeidosEmpresa` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chats_clienteId_empresaId_negocioId_key`(`clienteId`, `empresaId`, `negocioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `mensajes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatId` INTEGER NOT NULL,
    `remitente` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `resenas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `reservaId` INTEGER NULL,
    `calificacion` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resenas_clienteId_negocioId_reservaId_key`(`clienteId`, `negocioId`, `reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `favoritos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `favoritos_clienteId_negocioId_key`(`clienteId`, `negocioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'negocios_categoriaId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `negocios` ADD CONSTRAINT `negocios_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key negocios_categoriaId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'negocios_ciudadId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `negocios` ADD CONSTRAINT `negocios_ciudadId_fkey` FOREIGN KEY (`ciudadId`) REFERENCES `ciudades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key negocios_ciudadId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'negocios_propietarioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `negocios` ADD CONSTRAINT `negocios_propietarioId_fkey` FOREIGN KEY (`propietarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key negocios_propietarioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'negocio_fotos_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `negocio_fotos` ADD CONSTRAINT `negocio_fotos_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key negocio_fotos_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'servicios_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `servicios` ADD CONSTRAINT `servicios_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key servicios_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'reservas_clienteId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `reservas` ADD CONSTRAINT `reservas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key reservas_clienteId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'reservas_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `reservas` ADD CONSTRAINT `reservas_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key reservas_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'reservas_servicioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `reservas` ADD CONSTRAINT `reservas_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;',
    'SELECT "Foreign key reservas_servicioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'chats_clienteId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `chats` ADD CONSTRAINT `chats_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key chats_clienteId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'chats_empresaId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `chats` ADD CONSTRAINT `chats_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key chats_empresaId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'chats_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `chats` ADD CONSTRAINT `chats_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key chats_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'mensajes_chatId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key mensajes_chatId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'mensajes_usuarioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;',
    'SELECT "Foreign key mensajes_usuarioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'resenas_clienteId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `resenas` ADD CONSTRAINT `resenas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key resenas_clienteId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'resenas_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `resenas` ADD CONSTRAINT `resenas_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key resenas_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'favoritos_clienteId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key favoritos_clienteId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey (with safe check)
SET @foreign_key_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME = 'favoritos_negocioId_fkey'
);
SET @sql = IF(@foreign_key_exists = 0,
    'ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `negocios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'SELECT "Foreign key favoritos_negocioId_fkey already exists";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;




