/**
 * Script para crear un usuario admin
 * Uso: node create-admin.js
 * 
 * Asegúrate de tener la variable de entorno API_URL configurada
 * o modifica la URL directamente en el script
 */

const API_URL = process.env.API_URL || 'https://tu-dominio.com/api';

const adminData = {
  nombre: "Admin",
  apellido: "Sistema",
  email: "admin@reservatecuba.com",
  password: "Admin123!@#",
  telefono: "+53 7 000 0000",
  ciudad: "La Habana",
  rol: "admin"
};

async function createAdmin() {
  try {
    console.log('🚀 Creando usuario admin...');
    console.log(`📡 URL: ${API_URL}/auth/register`);
    console.log(`📧 Email: ${adminData.email}`);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Usuario admin creado exitosamente!');
      console.log('📋 Datos del usuario:');
      console.log(`   - ID: ${data.data.user.id}`);
      console.log(`   - Nombre: ${data.data.user.nombre} ${data.data.user.apellido}`);
      console.log(`   - Email: ${data.data.user.email}`);
      console.log(`   - Rol: ${data.data.user.rol}`);
      console.log('\n🔑 Credenciales de acceso:');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión!');
    } else {
      console.error('❌ Error al crear usuario admin:');
      console.error(`   ${data.message || JSON.stringify(data)}`);
      
      if (response.status === 400 && data.message?.includes('already exists')) {
        console.log('\n💡 El usuario admin ya existe. Puedes iniciar sesión con:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
      }
    }
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error(`   ${error.message}`);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. La aplicación esté desplegada y funcionando');
    console.log('   2. La URL de la API sea correcta');
    console.log('   3. La base de datos esté configurada correctamente');
  }
}

createAdmin();


