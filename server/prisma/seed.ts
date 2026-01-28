import { PrismaClient } from '@prisma/client';

// @ts-ignore - process is available at runtime
const prisma = new PrismaClient();

// Datos de provincias y municipios de Cuba
const provinciasYMunicipios = {
  'Pinar del Río': [
    'Pinar del Río', 'Consolación del Sur', 'La Palma', 'Los Palacios', 'Mantua',
    'Minas de Matahambre', 'San Juan y Martínez', 'San Luis', 'Sandino', 'Viñales'
  ],
  'Artemisa': [
    'Artemisa', 'Alquízar', 'Bauta', 'Caimito', 'Guanajay', 'Güira de Melena',
    'Mariel', 'San Antonio de los Baños', 'Bahía Honda', 'Candelaria', 'San Cristóbal'
  ],
  'La Habana': [
    'Playa', 'Plaza de la Revolución', 'Centro Habana', 'La Habana Vieja',
    'Regla', 'La Habana del Este', 'Guanabacoa', 'San Miguel del Padrón',
    'Diez de Octubre', 'Cerro', 'Marianao', 'La Lisa', 'Boyeros', 'Arroyo Naranjo',
    'Cotorro', 'San Antonio de los Baños'
  ],
  'Mayabeque': [
    'San José de las Lajas', 'Batabanó', 'Bejucal', 'Güines', 'Jaruco',
    'Madruga', 'Melena del Sur', 'Nueva Paz', 'Quivicán', 'San Nicolás',
    'Santa Cruz del Norte'
  ],
  'Matanzas': [
    'Matanzas', 'Cárdenas', 'Colón', 'Jagüey Grande', 'Jovellanos', 'Limonar',
    'Los Arabos', 'Martí', 'Pedro Betancourt', 'Perico', 'Unión de Reyes',
    'Varadero', 'Calimete', 'Ciénaga de Zapata'
  ],
  'Cienfuegos': [
    'Cienfuegos', 'Abreus', 'Aguada de Pasajeros', 'Cruces', 'Cumanayagua',
    'Lajas', 'Palmira', 'Rodas'
  ],
  'Villa Clara': [
    'Santa Clara', 'Caibarién', 'Camajuaní', 'Cifuentes', 'Corralillo',
    'Encrucijada', 'Manicaragua', 'Placetas', 'Quemado de Güines', 'Ranchuelo',
    'Remedios', 'Sagua la Grande', 'Santo Domingo'
  ],
  'Sancti Spíritus': [
    'Sancti Spíritus', 'Cabaiguán', 'Fomento', 'Jatibonico', 'La Sierpe',
    'Taguasco', 'Trinidad', 'Yaguajay'
  ],
  'Ciego de Ávila': [
    'Ciego de Ávila', 'Baraguá', 'Bolivia', 'Chambas', 'Ciro Redondo',
    'Florencia', 'Majagua', 'Morón', 'Primero de Enero', 'Venezuela'
  ],
  'Camagüey': [
    'Camagüey', 'Carlos Manuel de Céspedes', 'Esmeralda', 'Florida', 'Guáimaro',
    'Jimaguayú', 'Minas', 'Najasa', 'Nuevitas', 'Santa Cruz del Sur', 'Sibanicú',
    'Sierra de Cubitas', 'Vertientes'
  ],
  'Las Tunas': [
    'Las Tunas', 'Amancio', 'Colombia', 'Jesús Menéndez', 'Jobabo',
    'Majibacoa', 'Manatí', 'Puerto Padre'
  ],
  'Holguín': [
    'Holguín', 'Antilla', 'Báguanos', 'Banes', 'Cacocum', 'Calixto García',
    'Cueto', 'Frank País', 'Gibara', 'Mayarí', 'Moa', 'Rafael Freyre',
    'Sagua de Tánamo', 'Urbano Noris'
  ],
  'Granma': [
    'Bayamo', 'Bartolomé Masó', 'Buey Arriba', 'Campechuela', 'Cauto Cristo',
    'Guisa', 'Jiguaní', 'Manzanillo', 'Media Luna', 'Niquero', 'Pilón',
    'Río Cauto', 'Yara'
  ],
  'Santiago de Cuba': [
    'Santiago de Cuba', 'Contramaestre', 'Guamá', 'Mella', 'Palma Soriano',
    'San Luis', 'Segundo Frente', 'Songo-La Maya', 'Tercer Frente'
  ],
  'Guantánamo': [
    'Guantánamo', 'Baracoa', 'Caimanera', 'El Salvador', 'Imías', 'Maisí',
    'Manuel Tames', 'Niceto Pérez', 'San Antonio del Sur', 'Yateras'
  ],
  'Isla de la Juventud': [
    'Nueva Gerona', 'La Fe', 'Los Indios', 'Manteca', 'Punta del Este',
    'San Pedro', 'Siguanea'
  ]
};

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

  // Eliminar todas las provincias y municipios (esto eliminará en cascada)
  const deletedMunicipios = await prisma.municipio.deleteMany({});
  const deletedProvincias = await prisma.provincia.deleteMany({});
  console.log(`   ✅ Eliminadas ${deletedProvincias.count} provincias y ${deletedMunicipios.count} municipios`);

  // Eliminar otros datos relacionados
  await prisma.negocio.deleteMany({});
  await prisma.reserva.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.resena.deleteMany({});
  await prisma.favorito.deleteMany({});
  console.log('   ✅ Limpieza de datos relacionados completada\n');

  // 2. Crear categorías iniciales (5 categorías)
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
  ];

  for (const categoria of categorias) {
    const created = await prisma.categoria.create({
      data: categoria,
    });
    console.log(`   ✅ Categoría creada: ${created.nombre}`);
  }
  console.log('');

  // 3. Crear provincias y municipios
  console.log('🏙️  Creando provincias y municipios...');
  let totalMunicipios = 0;

  for (const [provinciaNombre, municipios] of Object.entries(provinciasYMunicipios)) {
    const provincia = await prisma.provincia.create({
      data: {
        nombre: provinciaNombre,
        municipios: {
          create: municipios.map((municipioNombre) => ({
            nombre: municipioNombre,
          })),
        },
      },
    });

    console.log(`   ✅ Provincia creada: ${provincia.nombre} (${municipios.length} municipios)`);
    totalMunicipios += municipios.length;
  }
  console.log('');

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - Usuario admin: ${adminUser ? '✅ Existe' : '❌ No encontrado'}`);
  console.log(`   - Categorías: ${categorias.length} creadas`);
  console.log(`   - Provincias: ${Object.keys(provinciasYMunicipios).length} creadas`);
  console.log(`   - Municipios: ${totalMunicipios} creados`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    // @ts-ignore - process is available at runtime
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
