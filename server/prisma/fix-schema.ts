import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSchema() {
  try {
    console.log('🔧 Preparando base de datos...');

    // Verificar y eliminar foreign key constraint si existe
    const fkCheck = await prisma.$queryRawUnsafe<Array<{COUNT: bigint}>>(
      `SELECT COUNT(*) as COUNT FROM information_schema.TABLE_CONSTRAINTS 
       WHERE CONSTRAINT_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'chats' 
       AND CONSTRAINT_NAME = 'chats_negocioId_fkey'`
    );
    
    if (fkCheck[0]?.COUNT > 0) {
      console.log('   Eliminando foreign key chats_negocioId_fkey...');
      await prisma.$executeRawUnsafe(`ALTER TABLE \`chats\` DROP FOREIGN KEY \`chats_negocioId_fkey\``);
    }

    // Verificar y eliminar el índice único si existe
    const indexCheck = await prisma.$queryRawUnsafe<Array<{COUNT: bigint}>>(
      `SELECT COUNT(*) as COUNT FROM information_schema.STATISTICS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'chats' 
       AND INDEX_NAME = 'chats_clienteId_empresaId_negocioId_key'`
    );
    
    if (indexCheck[0]?.COUNT > 0) {
      console.log('   Eliminando índice chats_clienteId_empresaId_negocioId_key...');
      await prisma.$executeRawUnsafe(`ALTER TABLE \`chats\` DROP INDEX \`chats_clienteId_empresaId_negocioId_key\``);
    }

    // Verificar y agregar provinciaId si no existe
    const provinciaCheck = await prisma.$queryRawUnsafe<Array<{COUNT: bigint}>>(
      `SELECT COUNT(*) as COUNT FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'negocios' 
       AND COLUMN_NAME = 'provinciaId'`
    );
    
    if (provinciaCheck[0]?.COUNT === 0) {
      console.log('   Agregando columna provinciaId...');
      await prisma.$executeRawUnsafe(`ALTER TABLE \`negocios\` ADD COLUMN \`provinciaId\` INTEGER NULL`);
    }

    // Verificar y agregar municipioId si no existe
    const municipioCheck = await prisma.$queryRawUnsafe<Array<{COUNT: bigint}>>(
      `SELECT COUNT(*) as COUNT FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'negocios' 
       AND COLUMN_NAME = 'municipioId'`
    );
    
    if (municipioCheck[0]?.COUNT === 0) {
      console.log('   Agregando columna municipioId...');
      await prisma.$executeRawUnsafe(`ALTER TABLE \`negocios\` ADD COLUMN \`municipioId\` INTEGER NULL`);
    }

    console.log('✅ Base de datos preparada');
  } catch (error: any) {
    console.error('⚠️ Error preparando base de datos:', error?.message || error);
    // No lanzar error, continuar con db push
  } finally {
    await prisma.$disconnect();
  }
}

fixSchema();

