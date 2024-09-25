const { response } = require('express');
const { Pool }= require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'Distribuidora NOPE',
    port: '5432'
})

function fechaActual() {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que hay que sumar 1
    const dia = fechaActual.getDate();
  
    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  
    return fechaFormateada;
}
  
function horaActual() {
    const fechaActual = new Date();
    const hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();
  
    const horaFormateada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  
    return horaFormateada;
}
  
pool.connect((error)=>{
    if(error){
        console.log('El error de conexión es: ' +error)
    }
    return(console.log("Conectado correctamente"))
})

/* const getClient = async(req,res)=>{
    const respuesta = await pool.query('select * from personas.clientes order by cliente_id');
    //console.log(repuesta.rows);
    //res.send('Clientes');
    res.status(200).json(respuesta.rows);
}  */

const getClient2 = async(req,res)=>{
    //res.send('Recibiendo ID para consulta: ' +req.params.id);
    const xid=req.params.id;
    const respuesta= await pool.query('select * from client where id=$1',[xid]);
    res.json(respuesta.rows);
    res.end;
}

const createClient = async(req,res)=>{
    /*console.log(res.body);
    res.send("Registro Creado");*/
    const { dni,nombre, direccion, telefono,email,url } = req.body;
    console.log(url)
    const repuesta = await pool.query("insert into personas.clientes (dni,nombre, direccion, telefono,email,estatus) values($1,$2,$3,$4,$5,'A')",[dni,nombre, direccion, telefono,email]);
    res.redirect(url); 
}
const updateClient=async(req, res)=>{
    const {cliente_id,dni,nombre,direccion,telefono,email} = req.body;
    const respuesta= await pool.query('update personas.clientes set dni=$1, nombre = $2, direccion = $3, telefono = $4, email = $5 where cliente_id = $6',[
        dni,
        nombre,
        direccion,
        telefono,
        email,
        cliente_id
    ]);
    console.log(respuesta);
    res.redirect('/client');
}

const delClient = async(req,res)=>{
    const xid=req.params.id;
    const respuesta = await pool.query("update personas.clientes set estatus='I' where cliente_id=$1",[xid]);
    console.log(respuesta);
    res.redirect('/client');
}

/*Cilindros */

const createCilindros= async(req,res)=>{
    const { serial,hidrostatica,propiedad,marca,tipo_gas_id,capacidad,estado,cliente_id,ubicacion,estatus,contenido,url } = req.body;
    console.log(serial, hidrostatica, propiedad, marca, tipo_gas_id, capacidad, estado, cliente_id, ubicacion, estatus);
    const respuesta = await pool.query("INSERT INTO producto.cilindros (serial, hidrostatica, propiedad, marca, tipo_gas_id, capacidad, estado, cliente_id, ubicacion, estatus, contenido) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);",
    [serial,
    hidrostatica,
    propiedad,
    marca,
    tipo_gas_id,
    capacidad,
    estado,
    cliente_id,
    ubicacion,
    estatus,
    contenido
]);
    
    console.log(respuesta);
    res.redirect(url);
};

const updateCilindros=async(req, res)=>{
    const { serial,hidrostatica,propiedad,marca,tipo_gas_id,capacidad,estado,cliente_id,ubicacion,estatus,cilindro_id,contenido } = req.body;
    console.log(serial,hidrostatica,propiedad,marca,tipo_gas_id,capacidad,estado,cliente_id,ubicacion,estatus,cilindro_id)
    const respuesta= await pool.query("UPDATE producto.cilindros SET serial=$1, hidrostatica=$2, propiedad=$3, marca=$4, tipo_gas_id=$5, capacidad=$6, estado=$7, cliente_id=$8, ubicacion=$9, estatus=$10, contenido=$12 WHERE cilindro_id=$11;",[
    serial,
    hidrostatica,
    propiedad,
    marca,
    tipo_gas_id,
    capacidad,
    estado,
    cliente_id,
    ubicacion,
    estatus,
    cilindro_id,
    contenido
    ]);
    console.log(respuesta);
    res.redirect('/cilindros');
}

const delCilindros = async(req,res)=>{
    const xid=req.params.id;
    const respuesta = await pool.query("update producto.cilindros set estatus='I' where cilindro_id=$1",[xid]);
    console.log(respuesta);
    res.redirect('/cilindros');
}

//Movimientos

const createMovimientos= async(req,res)=>{
    const { cliente_id,tipo_movimiento_id,chofer_id,descripcion } = req.body;
    const fecha_movimiento = fechaActual();
    const hora_movimiento = horaActual();
    const respuesta = await pool.query("INSERT INTO gestion.movimientos(cliente_id, tipo_movimiento_id, chofer_id,fecha_movimiento, hora_movimiento, descripcion, estatus) VALUES ($1, $2, $3, $4, $5, $6, 'A');",
    [cliente_id,
    tipo_movimiento_id,
    chofer_id,
    fecha_movimiento,
    hora_movimiento,
    descripcion]);
    
    console.log(respuesta);
    res.redirect('/movimientos');
};

const updateMovimientos=async(req, res)=>{
    const { movimiento_id,cliente_id,tipo_movimiento_id,chofer_id,descripcion } = req.body;
    console.log(movimiento_id,cliente_id,tipo_movimiento_id,chofer_id,descripcion);
    const respuesta= await pool.query("UPDATE gestion.movimientos SET cliente_id=$2, tipo_movimiento_id=$3, chofer_id=$4, descripcion=$5 WHERE movimiento_id=$1;",[
        movimiento_id,
        cliente_id,
        tipo_movimiento_id,
        chofer_id,
        descripcion
    ]);
    console.log(respuesta)
    res.redirect('/movimientos');
}

const createDetalles = async(req, res)=>{
    const { id,cil_id,cil_serial,cliente,cil_ubicacion,cil_contenido,url, } = req.body;
    const respuesta= await pool.query("UPDATE producto.cilindros SET cliente_id=$1, ubicacion=$2, contenido=$3 WHERE cilindro_id=$4",[
        cliente,
        cil_ubicacion,
        cil_contenido,
        cil_id
    ])

    const respuesta1= await pool.query("INSERT INTO gestion.detallemovimientos(movimiento_id, cilindro_id) VALUES ($1, $2);",
        [
            id,
            cil_id
        ]
    );
    res.redirect(url)
}

const createChoferes = async(req,res)=>{
    const { dni,nombre,licencia,telefono,estatus } = req.body;
    const repuesta = await pool.query("insert into personas.choferes (dni,nombre,licencia,telefono,estatus) values($1,$2,$3,$4,$5)",
    [dni,nombre,licencia,telefono,estatus]);
    console.log(repuesta);

    res.redirect('/choferes');
};

const updateChoferes=async(req, res)=>{
    const {chofer_id,dni,nombre,licencia,telefono,estatus} = req.body;
    const respuesta= await pool.query('update personas.choferes set dni=$1, nombre = $2, licencia = $3, telefono = $4, estatus = $5 where chofer_id = $6',[
        dni,
        nombre,
        licencia,
        telefono,
        estatus,
        chofer_id
    ]);
    console.log(respuesta);
    res.redirect('/choferes');
}

const delChoferes = async(req,res)=>{
    const xid=req.params.id;
    const respuesta = await pool.query("update personas.choferes set estatus='I' where chofer_id=$1",[xid]);
    console.log(respuesta);
    res.redirect('/choferes');
}

//Tipo de gas

const createTipoGas = async(req,res)=>{
    const { codigo_gas,nombre_gas,descripcion_gas,estatus_gas } = req.body;
    const repuesta = await pool.query("insert into producto.tiposdegas (codigo_gas,nombre_gas,descripcion_gas,estatus_gas) values($1,$2,$3,$4)",
    [codigo_gas,nombre_gas,descripcion_gas,estatus_gas]);
    console.log(repuesta);

    res.redirect('/tip');
};

const updateTipoGas=async(req, res)=>{
    const {tipo_gas_id,codigo_gas,nombre_gas,descripcion_gas} = req.body;
    const respuesta= await pool.query('update producto.tiposdegas set codigo_gas=$2, nombre_gas = $3, descripcion_gas = $4 where tipo_gas_id = $1',[
        tipo_gas_id,
        codigo_gas,
        nombre_gas,
        descripcion_gas,
    ]);
    console.log(respuesta);
    res.redirect('/tip');
}

const delTipoGas = async(req,res)=>{
    const xid=req.params.id;
    const respuesta = await pool.query("update producto.tiposdegas set estatus_gas='I' where tipo_gas_id=$1",[xid]);
    console.log(respuesta);
    res.redirect('/tip');
}

const login = async(req,res)=>{
    const {email, password} = req.body;
    const respuesta = await pool.query("SELECT rol FROM personas.usuarios WHERE email = $1 AND password = $2",[email,password]);
     inicio = JSON.stringify(respuesta.rows[0]);
    if( inicio === '{"rol":"admin"}' ){
        res.redirect("/home");
    } else if (inicio === '{"rol":"caja"}') {
        res.redirect("/caja")
    } else{
        res.redirect("/error")
    }

    console.log(inicio)
}

module.exports={
    pool,
    getClient2,
    createClient,
    updateClient,
    delClient,
    createCilindros,
    updateCilindros,
    delCilindros,
    createMovimientos,
    createDetalles,
    updateMovimientos,
    createChoferes,
    updateChoferes,
    delChoferes,
    createTipoGas,
    updateTipoGas,
    delTipoGas,
    login
}