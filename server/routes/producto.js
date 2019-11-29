const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// =======================================
// Mostrar todos los productos
// =======================================
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos 
    // Populate: usuario categoria
    // Paginado

    let restricciones = { disponible: true }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find(restricciones, 'nombre precioUni descripcion disponible categoria usuario')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Producto.countDocuments(restricciones, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo,
                })
            })

        })
})


// =======================================
// Obtener un producto por ID
// =======================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // Populate: usuario categoria
    // Paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            })
        })
})

// =======================================
// Buscar productos
// =======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
})


// =======================================
// Crear un nuevo producto
// =======================================
app.post('/productos', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado 

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        })


    });
})

// =======================================
// Actualizar un producto
// =======================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id,
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        })
    })

})


// =======================================
// Borrar un producto
// =======================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // disponible: false

    let id = req.params.id;


    let cambiaDisponibilidad = {
        disponible: false,
    }

    Producto.findByIdAndUpdate(id, cambiaDisponibilidad, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado,
        })
    })
})



module.exports = app;