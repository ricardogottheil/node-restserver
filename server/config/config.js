// ========================================
//  Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
//  Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
//  Vencimiento del token
// ========================================
//  60 segundos 
//  60 minutos  
//  24 horas 
//  30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================
//  SEED de autenticacion
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-secret-desarrollo';

'este-es-el-secret-produccion'


// ========================================
//  Base de datos
// ========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ========================================
//  Google Client ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '900239739314-maka1sq9u8n20gvv5tfuqsvbee86fnvc.apps.googleusercontent.com';