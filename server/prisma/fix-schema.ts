import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSchema() {
  try {
    console.log('🔧 Preparando base de datos...');

    // Encontrar y eliminar TODAS las foreign keys de la tabla chats
    const allFks = await prisma.$queryRawUnsafe<Array<{CONSTRAINT_NAME: string}>>(
      `SELECT CONSTRAINT_NAME 
       FROM information_schema.TABLE_CONSTRAINTS 
       WHERE CONSTRAINT_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'chats' 
       AND CONSTRAINT_TYPE = 'FOREIGN KEY'`
    );
    
    for (const fk of allFks) {
      try {
        console.log(`   Eliminando foreign key ${fk.CONSTRAINT_NAME}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE \`chats\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
      } catch (error: any) {
        console.log(`   ⚠️ No se pudo eliminar ${fk.CONSTRAINT_NAME}: ${error?.message || error}`);
      }
    }

    // Verificar y eliminar el índice único si existe (ahora que las FKs están eliminadas)
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

