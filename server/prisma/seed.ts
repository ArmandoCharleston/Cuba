import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // 1. Limpiar datos mock (excepto el admin)
  console.log('🧹 Limpiando datos mock...');
  
  // Eliminar todos los usuarios excepto el admin
  const adminEmail = 'admin@reservatecuba.com';
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (adminUser) {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: adminEmail,
        },
      },
    });
    console.log(`   ✅ Eliminados ${deletedUsers.count} usuarios (excepto admin)`);
  } else {
    console.log('   ⚠️  Admin no encontrado, saltando limpieza de usuarios');
  }

  // Eliminar todas las categorías existentes
  const deletedCategorias = await prisma.categoria.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedCategorias.count} categorías`);

  // Eliminar todas las ciudades existentes
  const deletedCiudades = await prisma.ciudad.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedCiudades.count} ciudades`);

  // Eliminar otros datos relacionados
  await prisma.negocio.deleteMany({});
  await prisma.reserva.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.resena.deleteMany({});
  await prisma.favorito.deleteMany({});
  console.log('   ✅ Limpieza de datos relacionados completada\n');

  // 2. Crear categorías iniciales
  console.log('📁 Creando categorías...');
  const categorias = [
    {
      nombre: 'Peluquería',
      icono: 'Scissors',
      descripcion: 'Cortes, peinados y tratamientos capilares',
    },
    {
      nombre: 'Spa & Masajes',
      icono: 'Sparkles',
      descripcion: 'Relajación y tratamientos corporales',
    },
    {
      nombre: 'Belleza',
      icono: 'Heart',
      descripcion: 'Manicure, pedicure y estética facial',
    },
    {
      nombre: 'Fitness',
      icono: 'Dumbbell',
      descripcion: 'Gimnasios y entrenamiento personal',
    },
    {
      nombre: 'Restaurantes',
      icono: 'UtensilsCrossed',
      descripcion: 'Reservas en restaurantes',
    },
    {
      nombre: 'Médico',
      icono: 'Stethoscope',
      descripcion: 'Consultas y tratamientos médicos',
    },
  ];

  for (const categoria of categorias) {
    const created = await prisma.categoria.create({
      data: categoria,
    });
    console.log(`   ✅ Categoría creada: ${created.nombre}`);
  }
  console.log('');

  // 3. Crear ciudades iniciales
  console.log('🏙️  Creando ciudades...');
  const ciudades = [
    { nombre: 'La Habana' },
    { nombre: 'Varadero' },
    { nombre: 'Santiago de Cuba' },
    { nombre: 'Trinidad' },
    { nombre: 'Viñales' },
    { nombre: 'Cienfuegos' },
    { nombre: 'Camagüey' },
    { nombre: 'Holguín' },
  ];

  for (const ciudad of ciudades) {
    const created = await prisma.ciudad.create({
      data: ciudad,
    });
    console.log(`   ✅ Ciudad creada: ${created.nombre}`);
  }
  console.log('');

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - Usuario admin: ${adminUser ? '✅ Existe' : '❌ No encontrado'}`);
  console.log(`   - Categorías: ${categorias.length} creadas`);
  console.log(`   - Ciudades: ${ciudades.length} creadas`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


