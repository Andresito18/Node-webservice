const express = require('express');

const { verificaToken } = require('../middlewares/autentificacion');

let app = express();
let Producto = require('../models/producto');

//=======================================
//Obtener Productos
//========================================
app.get('/producto', (req, res) => {
    //trae todos los productos
    //populate: usuaario, categoria
    // paginado

    let desde = req.query.body || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('usuarios', 'nombre email')
            .exec((err, productos) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
    
    Producto.count({disponible: false}, (err, conteo) => {
        res.json({
            ok: true,
            productos,
            cuantos: conteo
        });
    });
    
    });
});


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    
    let termino = req.params.termino;
    
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .exec( (err, productos ) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });
            });

});

//=======================================
//Obtener Producto por ID
//========================================
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es el correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


//=======================================
//crear producto
//========================================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: true,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=======================================
//Actualizar producto
//========================================
app.put('/producto/:id',verificaToken,  (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
        if (err){
            res.json({
            id
            });
        }  

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//=======================================
//Borrar un  producto
//========================================
app.delete('/producto/:id', verificaToken,  function(req, res) {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        });

    });
});


module.exports = app;