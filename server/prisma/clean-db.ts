import { PrismaClient } from '@prisma/client';

// @ts-ignore - process is available at runtime
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Iniciando limpieza de la base de datos (preservando admin)...\n');

  // 1. Buscar y preservar el admin
  const adminUser = await prisma.user.findFirst({
    where: { rol: 'admin' },
  });

  if (!adminUser) {
    console.log('⚠️  No se encontró ningún usuario admin en la base de datos.');
    console.log('   La limpieza continuará pero no se preservará ningún usuario.\n');
  } else {
    console.log(`✅ Admin encontrado: ${adminUser.email} (ID: ${adminUser.id})`);
    console.log('   Este usuario será preservado durante la limpieza.\n');
  }

  const adminEmail = adminUser?.email || 'admin@reservatecuba.com';
  const adminId = adminUser?.id;

  // 2. Eliminar usuarios (excepto admin)
  console.log('👥 Eliminando usuarios...');
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      ...(adminId ? { id: { not: adminId } } : { email: { not: adminEmail } }),
    },
  });
  console.log(`   ✅ Eliminados ${deletedUsers.count} usuarios (excepto admin)\n`);

  // 3. Eliminar fotos de negocios
  console.log('📸 Eliminando fotos de negocios...');
  const deletedFotos = await prisma.negocioFoto.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedFotos.count} fotos\n`);

  // 4. Eliminar negocios (esto eliminará automáticamente servicios, reservas, chats, etc. por cascada)
  console.log('🏢 Eliminando negocios...');
  const deletedNegocios = await prisma.negocio.deleteMany({});
  console.log(`   ✅ Eliminados ${deletedNegocios.count} negocios\n`);

  // 5. Eliminar reservas (por si acaso quedaron algunas)
  console.log('📅 Eliminando reservas...');
  const deletedReservas = await prisma.reserva.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedReservas.count} reservas\n`);

  // 6. Eliminar chats
  console.log('💬 Eliminando chats...');
  const deletedChats = await prisma.chat.deleteMany({});
  console.log(`   ✅ Eliminados ${deletedChats.count} chats\n`);

  // 7. Eliminar reseñas
  console.log('⭐ Eliminando reseñas...');
  const deletedResenas = await prisma.resena.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedResenas.count} reseñas\n`);

  // 8. Eliminar favoritos
  console.log('❤️  Eliminando favoritos...');
  const deletedFavoritos = await prisma.favorito.deleteMany({});
  console.log(`   ✅ Eliminados ${deletedFavoritos.count} favoritos\n`);

  // 9. Eliminar categorías
  console.log('📁 Eliminando categorías...');
  const deletedCategorias = await prisma.categoria.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedCategorias.count} categorías\n`);

  // 10. Eliminar municipios y provincias
  console.log('🏙️  Eliminando municipios y provincias...');
  const deletedMunicipios = await prisma.municipio.deleteMany({});
  const deletedProvincias = await prisma.provincia.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedProvincias.count} provincias y ${deletedMunicipios.count} municipios\n`);

  console.log('✅ Limpieza completada exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - Usuario admin: ${adminUser ? `✅ Preservado (${adminUser.email})` : '❌ No encontrado'}`);
  console.log(`   - Usuarios eliminados: ${deletedUsers.count}`);
  console.log(`   - Negocios eliminados: ${deletedNegocios.count}`);
  console.log(`   - Reservas eliminadas: ${deletedReservas.count}`);
  console.log(`   - Chats eliminados: ${deletedChats.count}`);
  console.log(`   - Reseñas eliminadas: ${deletedResenas.count}`);
  console.log(`   - Favoritos eliminados: ${deletedFavoritos.count}`);
  console.log(`   - Categorías eliminadas: ${deletedCategorias.count}`);
  console.log(`   - Provincias eliminadas: ${deletedProvincias.count}`);
  console.log(`   - Municipios eliminados: ${deletedMunicipios.count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la limpieza:', e);
    // @ts-ignore - process is available at runtime
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

