const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, 'La descripción es necesaria'],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
});

categoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe ser unico.',
});

module.exports = mongoose.model('Categoria', categoriaSchema);
