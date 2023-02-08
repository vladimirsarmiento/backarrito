'use strict'

var express = require('express');
var clienteController = require('../controllers/clienteController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);

api.get('/listar_clientes_filtro_admin/:tipo/:filtro?', auth.auth, clienteController.listar_clientes_filtro_admin);
api.post('/registro_cliente_admin', auth.auth, clienteController.registro_cliente_admin);
api.get('/obtener_cliente_admin/:id', auth.auth, clienteController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id', auth.auth, clienteController.eliminar_cliente_admin);
api.get('/obtener_cliente/:id', auth.auth, clienteController.obtener_cliente);
api.put('/actualizar_perfil_cliente/:id', auth.auth, clienteController.actualizar_perfil_cliente);

//Métodos públicos
api.post('/registro_cliente', clienteController.registro_cliente);

//Direcciones
api.post('/registro_direccion_cliente', auth.auth, clienteController.registro_direccion_cliente);
api.get('/obtener_direcciones_cliente/:id', auth.auth, clienteController.obtener_direcciones_cliente);
api.put('/cambiar_direccion_principal/:id/:cliente', auth.auth, clienteController.cambiar_direccion_principal);
api.delete('/eliminar_direccion_cliente/:id', auth.auth, clienteController.eliminar_direccion_cliente);
api.get('/obtener_direccion_principal_cliente/:id', auth.auth, clienteController.obtener_direccion_principal_cliente);



//Odenes
api.get('/obtener_ordenes_cliente/:id', auth.auth, clienteController.obtener_ordenes_cliente);
api.get('/obtener_detalles_orden_cliente/:id', auth.auth, clienteController.obtener_detalles_orden_cliente);
api.put('/actualizar_ventas_recibido/:id', auth.auth, clienteController.actualizar_ventas_recibido);



//Cuentas
api.get('/obtener_cuentas', auth.auth, clienteController.obtener_cuentas);

module.exports = api;
