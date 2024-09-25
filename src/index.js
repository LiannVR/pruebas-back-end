const express = require('express');
const app = express();
app.set('view engine','ejs')

//midlewares para procesar lo que viaja por la aplicación (funciones que se ejecutan antes de la llegada de los datos en diferentes formatos)

app.use(express.json()); //recibe datos para convertir a JSON
app.use(express.urlencoded({extended:false})); //recibe los datos desde el formulario y convierte a objestos

//rutas para el server
app.use(require('./routes/index'));
//puerto del servidor
app.listen(4000);
console.log('Todo ok en el server por el http://127.0.0.1:4000/login');