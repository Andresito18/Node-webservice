const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const app = express();

const Usuario = require('../models/usuario');
const { verificaToken, verificacionAdmin_Role } = require('../middlewares/autentificacion');

app.get('/usuario', verificaToken ,(req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Usuario.find({estado: true}, 'nombre email')
                .skip(desde)
                .limit(limite)
                .exec((err, usuarios) =>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
    
    Usuario.count({estado: true}, (err, conteo) =>{
        res.json({
            ok:true,
            usuarios,
            cuantos: conteo
        });
        });
    });
});
   
  app.post('/usuario', [verificaToken, verificacionAdmin_Role] , function (req, res) {
  
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
      
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

  });
  
  app.put('/usuario/:id', [verificaToken, verificacionAdmin_Role] , function (req, res) {
  
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
      
      
      delete body.password;
      delete body.google;

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators:true},(err, usuarioDB) =>{
        
        if (err){
            res.json({
            id
            });
        }  
            res.json({
                ok: true,
                usuario: usuarioDB,
                
            });
      });
  
  });

  
  app.delete('/usuario/:id', [verificaToken, verificacionAdmin_Role] , function (req, res) {
      let id = req.params.id;
      
      let cambiaEstado = {
          estado: false
      }

      Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, verificaToken ,(err, usuarioB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioB
        });
      });
  });


  module.exports = app;