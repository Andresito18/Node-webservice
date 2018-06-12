//============
//PUERTO
//============

process.env.PORT = process.env.PORT || 3000;

//============
//ENTORNO
//=========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 
//============
// Vencimiento del token
//=========
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 *30;



//============
// SEED de autentificacion
//=========

process.env.SEED = process.env.SEED ||  'secret-de-product-deererertte';


//============
// Base de datos
//=========

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/EjemploWebService';
}else{
    urlDB = process.env.MONGO_URL;
}


process.env.URLDB = urlDB;

//============
// Google client Id
//=========

process.env.CLIENT_ID = process.env.CLIENT_ID || '1008716627014-vif2ic1jgkr0ih35kgigs1sggbpv8ek9.apps.googleusercontent.com';