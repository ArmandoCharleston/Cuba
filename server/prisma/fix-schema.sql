-- Script para preparar la base de datos antes de db push
-- Elimina constraints problemáticas que impiden la sincronización

-- Eliminar foreign key constraint que depende del índice único
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'chats' 
    AND CONSTRAINT_NAME = 'chats_negocioId_fkey'
);
SET @sql = IF(@fk_exists > 0,
    'ALTER TABLE `chats` DROP FOREIGN KEY `chats_negocioId_fkey`;',
    'SELECT "FK chats_negocioId_fkey does not exist";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar el índice único problemático
SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'chats' 
    AND INDEX_NAME = 'chats_clienteId_empresaId_negocioId_key'
);
SET @sql = IF(@index_exists > 0,
    'ALTER TABLE `chats` DROP INDEX `chats_clienteId_empresaId_negocioId_key`;',
    'SELECT "Index chats_clienteId_empresaId_negocioId_key does not exist";'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar columnas provinciaId y municipioId si no existen
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'negocios' AND COLUMN_NAME = 'provinciaId');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE `negocios` ADD COLUMN `provinciaId` INTEGER NULL;', 'SELECT "Column provinciaId already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'negocios' AND COLUMN_NAME = 'municipioId');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE `negocios` ADD COLUMN `municipioId` INTEGER NULL;', 'SELECT "Column municipioId already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


