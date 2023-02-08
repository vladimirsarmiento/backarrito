'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el cliente
var cuentaSchema = Schema({
    banco: {type: String, required: true},
    titular: {type: String, required: true},
    cuenta: {type: Number, required: false},
    cci: {type: Number, required: true},
    color: {type: String, required: true},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('cuenta', cuentaSchema);