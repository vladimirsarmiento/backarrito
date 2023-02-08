'use strict'

var express = require('express');
var configController = require('../controllers/configController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
const path = multiparty({uploadDir: './uploads/configs'});

api.put('/actualizar_config_admin/:id', [auth.auth, path], configController.actualizar_config_admin);
api.get('/obtener_config_admin', auth.auth, configController.obtener_config_admin);
api.get('/obtener_logo/:img', configController.obtener_logo);
api.get('/obtener_banner/:img', configController.obtener_banner);
api.get('/obtener_config_publico', configController.obtener_config_publico);

api.put('/agregar_imagen_banner_admin/:id', [auth.auth, path], configController.agregar_imagen_banner_admin);
api.put('/eliminar_imagen_banner_admin/:id', auth.auth, configController.eliminar_imagen_banner_admin);

module.exports = api;
