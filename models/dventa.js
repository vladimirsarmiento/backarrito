'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el inventario
var DventaSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    subtotal: {type: Number, required: true},
    variedad: {type: String, required: true},
    cantidad: {type: Number, required: true},
    descuento: {type: Number, required: false},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('dventa', DventaSchema);