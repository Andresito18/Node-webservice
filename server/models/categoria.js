const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaShema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion  es necessaria']
    },
    usuario : { type: Schema.Types.ObjectId, ref: 'Usuario'}, 
});

module.exports = mongoose.model('categorias', categoriaShema);

