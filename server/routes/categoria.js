
const express = require('express');

const { verificaToken } = require('../middlewares/autentificacion');

const app = express();

let Categoria = require('../models/categoria');


//==============================
//Mostrar todas las categorias
//==============================
app.get('/categoria', verificaToken ,(req,res) => {

    Categoria.find({})
             .exec((err, categorias) =>{
                 if(err){
                     return res.status(500).json({
                         ok: false,
                         err
                     });
                 }

        res.json({
            ok: true,
            categorias
        });
    });

});

//==============================
//Mostrar categoria por id
//==============================
app.get('/categoria/:id', (req,res) => {
    
    let id = req.params.id;

    Categoria.findById(id,  (err ,  categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es el correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

//==============================
//insertar categoria nueva
//==============================
app.post('/categoria', verificaToken,  (req,res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: true,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//==============================
//Actualizar Categoria
//==============================
app.put('/categoria/:id', (req,res) => {

    let id = req.params.id;

    let body = req.body

    Categoria.findByIdAndUpdate(id, body, {new : true, runValidators: true},(err, categoriaDB) => {
        if (err){
            res.json({
            id
            });
        }  
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', (req,res) =>{
    let id = req.params.id;



    Categoria.findByIdAndRemove(id, (err, categoriaDB)=> {
        if (err){
            res.json({
            id
            });
        }  

        res.json({
            ok: true,
            categoria: categoriaDB,
            err: {
                message: "Se ah elminado correctamenta"
            }
        })
    })
});




















module.exports  = app;