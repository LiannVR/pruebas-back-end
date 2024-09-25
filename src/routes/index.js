const { Router, request, response } = require('express');
const router = Router();


//Importar rutas de los metodos del crud
const {pool, getClient2, createClient, updateClient, delClient, createCilindros, updateCilindros, delCilindros, createMovimientos, createDetalles, updateMovimientos, createChoferes, updateChoferes, delChoferes, createTipoGas, updateTipoGas, delTipoGas, login} = require('../controllers/index.controller');

router.get('/login',(request,response)=>{
    response.render('../views/login.ejs');
})
router.get('/error',(request,response)=>{
    response.render('../views/error.ejs');
})
router.get('/home',(request,response)=>{
    response.render('../views/home.ejs');
})
router.post('/auth',login);
router.get('/caja',(request,response)=>{
    response.render('../views/caja.ejs');
})

/* Rutas Cilindros*/
router.get('/cilindros',(request,response)=>{
    pool.query("SELECT cilindro_id, serial, hidrostatica, propiedad, marca, tiposdegas.nombre_gas, capacidad, estado, clientes.nombre as cliente_id, ubicacion, cilindros.estatus, contenido FROM producto.cilindros join producto.tiposdegas on cilindros.tipo_gas_id=tiposdegas.tipo_gas_id join personas.clientes on cilindros.cliente_id=clientes.cliente_id WHERE cilindros.estatus='A' order by cilindro_id desc;", (error, results)=>{
        if(error){
            console.log('router.get '+error);
        }else
        {
            response.render('../views/cilindros/getCilindros.ejs',{results:results}); //envía resultados de la consulta
        }
    }) 
});
router.post('/save_cil',createCilindros);

router.get('/create_cil',(req,res)=>{
    url = '/create_cil'
    pool.query("select * from producto.tiposdegas where estatus_gas='A'",(error, tiposdegas)=>{
        if(error){
            console.log("router.get "+error);
        }else{
            pool.query("select * from personas.clientes where estatus='A'",(err,clientes)=>{
                if(err){
                    console.log("router.get "+err);
                }else{
                    res.render('../views/cilindros/createCilindros.ejs', {tiposdegas:tiposdegas, clientes:clientes, url:url})
                }
            })
        }
    })

})

router.post('/update_cil', updateCilindros);

router.get('/edit_cil/:id',(request,response)=>{
	const id=request.params.id;
	pool.query('select * from producto.cilindros where cilindro_id=$1',[id],(error,results)=>{
        pool.query("select cliente_id, nombre from personas.clientes where estatus='A'",(err,clientes)=>{
            if(err){
                throw err;
            }else{
                console.log(results, clientes);
                response.render('../views/cilindros/updateCilindros.ejs',{cilindro:results.rows[0],clientes:clientes});
            }
        })
	})
})

router.get('/delete_cil/:id',(request,response)=>{
    const id=request.params.id;
	pool.query('select * from producto.cilindros where cilindro_id=$1',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            console.log(results);
			response.render('../views/cilindros/deleteCilindros.ejs',{cilindro:results.rows[0]});
		}
	})
});
router.post('/delete_cil/:id',delCilindros);



/* Rutas Clientes*/
router.get('/client',(request,response)=>{
    let url = '/client'
    pool.query("SELECT * FROM personas.clientes where estatus='A' order by cliente_id desc", (error, results)=>{
        if(error){
            console.log('router.get '+error);
        }else
        {
            response.render('../views/clientes/getClient',{results:results,url:url}); //envía resultados de la consulta
        }
    })
});

// router.get('/client/:id',(request,response)=>{
//     const xid=request.params.id;
//     pool.query('select * from client where id=$1',[xid], (error, results)=>{
//         if(error){
//             console.log('router.get '+error);
//         }else
//         {
//             response.render('../views/clientes/getClient',{results:results}); //envía resultados de la consulta
//         }
//     })
// });

router.post('/save',createClient);

router.get('/create',(req,res)=>{
    res.render('../views/clientes/createClient.ejs')
})

router.get('/delete/:id',(request,response)=>{
    const id=request.params.id;
	pool.query('select * from personas.clientes where cliente_id=$1',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            console.log(results);
			response.render('../views/clientes/deleteClient.ejs',{cliente:results.rows[0]});
		}
	})
});
router.post('/delete/:id',delClient);

router.post('/update', updateClient);

router.get('/edit/:id',(request,response)=>{
	const id=request.params.id;
	pool.query('select * from personas.clientes where cliente_id=$1',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            console.log(results);
			response.render('../views/clientes/updateClient.ejs',{cliente:results.rows[0]});
		}
	})
})

//rutas definidas
router.get('/client/:id',getClient2);//Consulta especifica
router.post('/client/',createClient);///insertar nuevo registro

//Ruta Choferes
router.get('/choferes',(request,response)=>{
    pool.query("SELECT * FROM personas.choferes where estatus='A'", (error, results)=>{
        if(error){
            console.log('router.get '+error);
        }else
        {
            response.render('../views/choferes/getChoferes',{results:results}); //envía resultados de la consulta
        }
    })
});

router.get('/create_cho',(req,res)=>{
    res.render('../views/choferes/createChoferes.ejs')
})

router.post('/save_cho',createChoferes);

router.get('/edit_cho/:id',(request,response)=>{
	const id=request.params.id;
	pool.query('select * from personas.choferes where chofer_id=$1',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            console.log(results);
			response.render('../views/choferes/updateChoferes.ejs',{chofer:results.rows[0]});
		}
	})
})

router.post('/update_cho', updateChoferes);

router.get('/delete_cho/:id',delChoferes);

//Rutas Movimientos
router.get('/movimientos',(request,response)=>{
    pool.query("SELECT movimiento_id, clientes.nombre as cliente_id, tiposdemovimiento.nombre_tipo_movimiento as tipo_movimiento_id, choferes.nombre as chofer_id, fecha_movimiento, hora_movimiento, descripcion, movimientos.estatus FROM gestion.movimientos join personas.clientes on movimientos.cliente_id = clientes.cliente_id join gestion.tiposdemovimiento on movimientos.tipo_movimiento_id=tiposdemovimiento.tipo_movimiento_id join personas.choferes on movimientos.chofer_id = choferes.chofer_id where movimientos.estatus = 'A' order by movimiento_id desc", (error, results)=>{
        if(error){
            console.log('router.get '+error);
        }else
        {
            response.render('../views/movimientos/getMovimientos.ejs',{results:results}); //envía resultados de la consulta
        }
    }) 
});

router.post('/save_mov',createMovimientos);

router.get('/create_mov',(request,response)=>{
    let url = '/create_mov'
    pool.query("SELECT * FROM personas.clientes where estatus='A' order by cliente_id desc ", (error, results)=>{
        pool.query("SELECT * FROM personas.choferes where estatus='A'",(err,choferes)=>{
            pool.query("SELECT tipo_movimiento_id, nombre_tipo_movimiento, descripcion_tipo_movimiento FROM gestion.tiposdemovimiento",(er,tipo_mov)=>{
                if(error){
                    console.log('router.get '+error);
                }else
                {
                    response.render('../views/movimientos/createMovimientos.ejs',{results:results, choferes:choferes, tipo_mov:tipo_mov, url:url}); //envía resultados de la consulta
                }
            })
        })
    })
});

router.get('/add/:id',(request,response)=>{
    const id=request.params.id;
    url = '/add/' + id;
    pool.query("SELECT cilindro_id, serial, hidrostatica, propiedad, marca, tiposdegas.nombre_gas, capacidad, estado, clientes.nombre, clientes.cliente_id, ubicacion, cilindros.estatus, contenido FROM producto.cilindros join producto.tiposdegas on cilindros.tipo_gas_id=tiposdegas.tipo_gas_id join personas.clientes on cilindros.cliente_id=clientes.cliente_id WHERE cilindros.estatus='A' order by cilindro_id desc",(error,cilindros)=>{
        pool.query("select * from producto.tiposdegas where estatus_gas='A'",(erro, tiposdegas)=>{
                pool.query("select * from personas.clientes where estatus='A'",(err,clientes)=>{
                    pool.query("SELECT detallemovimientos.movimiento_id, cilindros.serial AS serial, cilindros.ubicacion, cilindros.contenido, cilindros.tipo_gas_id, tiposdegas.nombre_gas, cilindros.cliente_id, clientes.nombre FROM gestion.detallemovimientos JOIN producto.cilindros ON detallemovimientos.cilindro_id=cilindros.cilindro_id join personas.clientes ON cilindros.cliente_id=clientes.cliente_id join producto.tiposdegas on cilindros.tipo_gas_id=tiposdegas.tipo_gas_id WHERE movimiento_id =$1",[id],(e,detalles)=>{
                        pool.query("select movimientos.cliente_id, clientes.nombre from gestion.movimientos join personas.clientes on movimientos.cliente_id=clientes.cliente_id where movimiento_id = $1",[id],(e,movimiento)=>{
                            response.render('../views/movimientos/detalles/createDetalles.ejs', {tiposdegas:tiposdegas, clientes:clientes, cilindros:cilindros, id:id, detalles:detalles, movimiento:movimiento.rows[0], url:url})
                        })
                    })
                })
        })
    })
})
router.post('/save_del', createDetalles);

router.post('/update_mov', updateMovimientos);

router.get('/edit_mov/:id',(request,response)=>{
	const id=request.params.id;
	pool.query('SELECT movimiento_id, movimientos.cliente_id, clientes.nombre as nombre , movimientos.tipo_movimiento_id, tiposdemovimiento.nombre_tipo_movimiento as tipo_movimiento , movimientos.chofer_id, choferes.nombre as chofer, fecha_movimiento, hora_movimiento, descripcion FROM gestion.movimientos join personas.clientes on movimientos.cliente_id=clientes.cliente_id join personas.choferes on movimientos.chofer_id=choferes.chofer_id join gestion.tiposdemovimiento on movimientos.tipo_movimiento_id=tiposdemovimiento.tipo_movimiento_id where movimiento_id=$1;',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            pool.query("select cliente_id, nombre from personas.clientes",(err,clientes)=>{
                if(err){
                    throw err;
                }else{
                    pool.query("select tipo_movimiento_id, nombre_tipo_movimiento from gestion.tiposdemovimiento",(er,tipo_movimiento)=>{
                        if(er){
                            throw er;
                        }else{
                            pool.query("select chofer_id, nombre from personas.choferes",(e,choferes)=>{
                                if(e){
                                    throw e;
                                }else{
                                    response.render('../views/movimientos/updateMovimientos.ejs',{movimiento:results.rows[0],clientes:clientes,tipo_movimiento:tipo_movimiento,choferes:choferes});
                                }
                            })
                        }
                    })
                }
            })
		}
	})
})

//Detalles

router.get('/detalles/:id',(request,response)=>{
    const id=request.params.id;
    pool.query("SELECT detallemovimientos.movimiento_id, cilindros.serial AS serial FROM gestion.detallemovimientos JOIN producto.cilindros ON detallemovimientos.cilindro_id=cilindros.cilindro_id WHERE movimiento_id =$1",[id],(error,results)=>{
        if(error){
            throw error;
        }else{
            response.render('../views/movimientos/detalles/detalles.ejs',{results:results});
        }
    })
})

//Tipo de gas

router.get('/tip',(request,response)=>{
    pool.query("SELECT * FROM producto.tiposdegas where estatus_gas='A'", (error, results)=>{
        if(error){
            console.log('router.get '+error);
        }else
        {
            response.render('../views/tipo_gas/getTipoGas',{results:results}); //envía resultados de la consulta
        }
    })
});

router.get('/create_tip',(req,res)=>{
    res.render('../views/tipo_gas/createTipoGas.ejs')
})

router.post('/save_tip',createTipoGas);

router.get('/edit_tip/:id',(request,response)=>{
	const id=request.params.id;
	pool.query('select * from producto.tiposdegas where tipo_gas_id=$1',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
            console.log(results);
			response.render('../views/tipo_gas/updateTipoGas.ejs',{tipo_gas:results.rows[0]});
		}
	})
})

router.post('/update_tip',updateTipoGas);

router.get('/delete_tip/:id',delTipoGas);

module.exports=router;