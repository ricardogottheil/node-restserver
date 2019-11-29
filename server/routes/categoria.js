const express = require('express');

let {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =======================================
// Mostrar todas las categorías
// =======================================
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias: categorias,
      });
    });
});

// =======================================
// Mostrar categoria por ID
// =======================================
app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe',
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// =======================================
// Crear nueva categoría
// =======================================
app.post('/categoria/', verificaToken, (req, res) => {
  // Regresa la nueva categoria
  // req.usuario._id

  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// =======================================
// Actualizar categoria
// =======================================
app.put('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true, context: 'query' },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// =======================================
// Eliminar categoria
// =======================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  // Solo un administrador puede borrar categorias
  // Categoria.findById(...)

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe',
        },
      });
    }

    res.json({
      ok: true,
      message: 'Categoria borrada exitosamente',
    });
  });
});

module.exports = app;
