'use strict'

var express = require('express');
var adiminController = require('../controllers/adminController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_admin', adiminController.registro_admim);
api.post('/login_admin', adiminController.login_admin);
api.get('/obtener_admin/:id', auth.auth, adiminController.obtener_admin);
api.get('/obtener_logo/:img', adiminController.obtener_logo);
api.get('/obtener_mensajes_admin', auth.auth, adiminController.obtener_mensajes_admin);
api.put('/cerrar_mensaje_admin/:id', auth.auth, adiminController.cerrar_mensaje_admin);

api.get('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, adiminController.obtener_ventas_admin);
api.get('/obtener_venta_admin/:id?', auth.auth, adiminController.obtener_venta_admin);
api.put('/actualizar_ventas_enviado_admin/:id', auth.auth, adiminController.actualizar_ventas_enviado_admin);
api.put('/actualizar_ventas_procesando_admin/:id', auth.auth, adiminController.actualizar_ventas_procesando_admin);
api.put('/actualizar_ventas_recibido_admin/:id', auth.auth, adiminController.actualizar_ventas_recibido_admin);

//Software
api.get('/obtener_ventas_software_admin/:desde?/:hasta?', auth.auth, adiminController.obtener_ventas_software_admin);
api.get('/obtener_venta_software_admin/:id?', auth.auth, adiminController.obtener_venta_software_admin);

api.put('/actualizar_venta_software_pagado_admin/:id', auth.auth, adiminController.actualizar_venta_software_pagado_admin);
api.delete('/eliminar_venta_software_admin/:id', auth.auth, adiminController.eliminar_venta_software_admin);

api.get('/kpi_ganancias_mensuales_admin', auth.auth, adiminController.kpi_ganancias_mensuales_admin);
api.get('/kpi_ganancias_programas_admin', auth.auth, adiminController.kpi_ganancias_programas_admin);

/////// CUENTAS
api.post('/registro_cuenta_admin', auth.auth, adiminController.registro_cuenta_admin);
api.get('/obtener_cuentas_admin', auth.auth, adiminController.obtener_cuentas_admin);
api.get('/obtener_cuenta_admin/:id', auth.auth, adiminController.obtener_cuenta_admin);
api.delete('/eliminar_cuenta_admin/:id', auth.auth, adiminController.eliminar_cuenta_admin);
api.put('/actualizar_cuenta_admin/:id', auth.auth, adiminController.actualizar_cuenta_admin);

module.exports = api;
