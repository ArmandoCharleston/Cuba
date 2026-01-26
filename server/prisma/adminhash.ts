// Script temporal para generar hash de contraseña del admin
// ⚠️ NO SUBIR A GIT - Este archivo debe estar en .gitignore
import * as bcrypt from 'bcryptjs';

async function generateHash() {
  // ⚠️ CAMBIA ESTA CONTRASEÑA antes de ejecutar
  const password = '12#@cargloTe'; // Cambia esta contraseña por la que quieras usar
  
  try {
    const hash = await bcrypt.hash(password, 10);
    
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ HASH GENERADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('CONTRASEÑA USADA:', password);
    console.log('');
    console.log('COPIA ESTE HASH (línea completa):');
    console.log('');
    console.log(hash);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 Usa este hash en el INSERT SQL en DBeaver');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n');
  } catch (error) {
    console.error('❌ Error generando hash:', error);
    // @ts-ignore - process is available at runtime
    process.exit(1);
  }
}

generateHash();

