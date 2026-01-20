-- AlterTable
ALTER TABLE `negocios` ADD COLUMN `estado` ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente';

