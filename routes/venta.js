'use strict'

var express = require('express');
var ventaController = require('../controllers/ventaController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_compra_cliente', auth.auth, ventaController.registro_compra_cliente);
api.post('/registro_compra_software', auth.auth, ventaController.registro_compra_software);
api.post('/registro_reservacion_cliente', auth.auth, ventaController.registro_reservacion_cliente);
api.get('/enviar_correo_cliente/:id', auth.auth, ventaController.enviar_correo_cliente);
api.get('/enviar_correo_reservacion_cliente/:id', auth.auth, ventaController.enviar_correo_reservacion_cliente);
api.get('/enviar_correo_confirmacion_admin/:id', auth.auth, ventaController.enviar_correo_confirmacion_admin);
api.post('/enviar_correo_enviado_admin/:id', auth.auth, ventaController.enviar_correo_enviado_admin);
api.get('/enviar_correo_recepcion_admin/:id', auth.auth, ventaController.enviar_correo_recepcion_admin);

api.delete('/eliminar_reservacion_admin/:id', auth.auth, ventaController.eliminar_reservacion_admin);

//Programas
api.post('/registro_reservacion_software_cliente', auth.auth, ventaController.registro_reservacion_software_cliente);
api.put('/actualizar_venta_software_descargado/:id', auth.auth, ventaController.actualizar_venta_software_descargado);

module.exports = api;
