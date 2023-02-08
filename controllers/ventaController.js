
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var Producto = require('../models/producto');
var Carrito = require('../models/carrito');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');

const registro_compra_cliente = async function (req, res) {
    if (req.user) {

        var data = req.body;
        let detalles = data.detalles;

        var venta_last = await Venta.find().sort({ cretedAt: -1 });
        var serie;
        var correlativo;
        var nventa;

        if (venta_last.length == 0) {
            serie = '001';
            correlativo = '000001';

            nventa = serie + '-' + correlativo;
        } else {
            // Más de un registro en venta
            var last_nventa = venta_last[0].nventa;
            var arr_nventa = last_nventa.split('-');

            if (arr_nventa[1] != '999999') {
                var new_correlativo = zfill(parseInt(arr_nventa[1]) + 1, 6);
                nventa = arr_nventa[0] + '-' + new_correlativo;

            } else if (arr_nventa[1] == '999999') {
                var new_serie = zfill(parseInt(arr_nventa[0]) + 1, 3);
                nventa = new_serie[0] + '-000001';
            }
        }
        data.nventa = nventa;
        data.estado = 'Procesando';

        let venta = await Venta.create(data);

        detalles.forEach(async element => {
            element.venta = venta._id;
            await Dventa.create(element);

            //Obtener producto de cada arreglo de datalle
            let element_producto = await Producto.findById({ _id: element.producto });
            let new_stock = element_producto.stock - element.cantidad;
            let n_ventas = element_producto.nventas + element.cantidad;

            //Actualizar el stock del producto con un nuevop stock
            await Producto.findByIdAndUpdate({ _id: element.producto }, {
                stock: new_stock,
                nventas: n_ventas
            });

            //Limpiar carrito de compras al finalizar una compra
            await Carrito.remove({ cliente: data.cliente });
        });

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const registro_compra_software = async function (req, res) {
    if (req.user) {

        var data = req.body;
        var nventa = 0;
        var venta_last = await VentaSoftware.find().sort({ cretedAt: -1 });

        if (venta_last.length == 0) {
            nventa = 1;
        } else {
            nventa = venta_last.length + 1;
        }

        data.nventa = parseInt(nventa);

        let venta = await VentaSoftware.create(data);

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const registro_reservacion_cliente = async function (req, res) {
    if (req.user) {

        var data = req.body;
        let detalles = data.detalles;

        var venta_last = await Venta.find().sort({ cretedAt: -1 });
        var serie;
        var correlativo;
        var nventa;

        if (venta_last.length == 0) {
            serie = '001';
            correlativo = '000001';

            nventa = serie + '-' + correlativo;
        } else {
            // Más de un registro en venta
            var last_nventa = venta_last[0].nventa;
            var arr_nventa = last_nventa.split('-');

            if (arr_nventa[1] != '999999') {
                var new_correlativo = zfill(parseInt(arr_nventa[1]) + 1, 6);
                nventa = arr_nventa[0] + '-' + new_correlativo;

            } else if (arr_nventa[1] == '999999') {
                var new_serie = zfill(parseInt(arr_nventa[0]) + 1, 3);
                nventa = new_serie[0] + '-000001';
            }
        }
        data.nventa = nventa;
        data.estado = 'Reservado';

        let venta = await Venta.create(data);

        detalles.forEach(async element => {
            element.venta = venta._id;
            await Dventa.create(element);

            //Obtener producto de cada arreglo de datalle
            let element_producto = await Producto.findById({ _id: element.producto });
            let new_stock = element_producto.stock - element.cantidad;
            let n_ventas = element_producto.nventas + element.cantidad;

            //Actualizar el stock del producto con un nuevop stock
            await Producto.findByIdAndUpdate({ _id: element.producto }, {
                stock: new_stock,
                nventas: n_ventas
            });

            //Limpiar carrito de compras al finalizar una compra
            await Carrito.remove({ cliente: data.cliente });
        });

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const registro_reservacion_software_cliente = async function (req, res) {
    if (req.user) {

        var data = req.body;
        var nventa = 0;
        var venta_last = await VentaSoftware.find().sort({ cretedAt: -1 });

        if (venta_last.length == 0) {
            nventa = 1;
        } else {
            nventa = venta_last.length + 1;
        }

        data.nventa = parseInt(nventa);

        let venta = await VentaSoftware.create(data);

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_reservacion_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            var id = req.params['id'];
            let reg = await Venta.findByIdAndRemove({ _id: id });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_venta_software_descargado = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];
        let reg = await VentaSoftware.findByIdAndUpdate({ _id: id }, { descargado: 'Descargado' });
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

//rellenar de 0 un arreglo
function zfill(number, width) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = '0';

    if (width <= length) {
        if (number < 0) {
            return ('-' + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ('-' + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }

    }
}

const enviar_correo_reservacion_cliente = async function (req, res) {

    var id = req.params['id'];

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'hjm.tienda.compra@gmail.com',
            pass: 'sxmmbvxebipxisbf'
        }
    }));

    //cliente _id fecha data subtotal

    var venta = await Venta.findById({ _id: id }).populate('cliente');
    var detalles = await Dventa.find({ venta: id }).populate('producto');

    var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    var _id = venta._id.toString().toUpperCase();
    var fecha = new Date(venta.createdAt);
    var data = detalles;
    var subtotal = venta.subtotal;
    var precio_envio = venta.envio_precio;

    readHTMLFile(process.cwd() + '/mail-reservation.html', (err, html) => {

        let rest_html = ejs.render(html, {
            data: data,
            cliente: cliente,
            _id: _id,
            fecha: fecha,
            subtotal: subtotal,
            precio_envio: precio_envio
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'hjm.tienda.compra@gmail.com',
            to: venta.cliente.email,
            subject: 'Gracias por tu reservación, HJM',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const enviar_correo_cliente = async function (req, res) {

    var id = req.params['id'];

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'hjm.tienda.compra@gmail.com',
            pass: 'sxmmbvxebipxisbf'
        }
    }));

    //cliente _id fecha data subtotal

    var venta = await Venta.findById({ _id: id }).populate('cliente');
    var detalles = await Dventa.find({ venta: id }).populate('producto');

    var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    var _id = venta._id.toString().toUpperCase();
    var fecha = new Date(venta.createdAt);
    var data = detalles;
    var subtotal = venta.subtotal;
    var precio_envio = venta.envio_precio;

    readHTMLFile(process.cwd() + '/mail.html', (err, html) => {

        let rest_html = ejs.render(html, {
            data: data,
            cliente: cliente,
            _id: _id,
            fecha: fecha,
            subtotal: subtotal,
            precio_envio: precio_envio
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'hjm.tienda.compra@gmail.com',
            to: venta.cliente.email,
            subject: 'Gracias por tu compra, HJM',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const enviar_correo_confirmacion_admin = async function (req, res) {

    var id = req.params['id'];

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'hjm.tienda.compra@gmail.com',
            pass: 'sxmmbvxebipxisbf'
        }
    }));

    //cliente _id fecha data subtotal

    var venta = await Venta.findById({ _id: id }).populate('cliente');
    var detalles = await Dventa.find({ venta: id }).populate('producto');

    var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    var _id = venta._id.toString().toUpperCase();
    var fecha = new Date(venta.createdAt);
    var data = detalles;
    var subtotal = venta.subtotal;
    var precio_envio = venta.envio_precio;

    readHTMLFile(process.cwd() + '/mail-confirmation.html', (err, html) => {

        let rest_html = ejs.render(html, {
            data: data,
            cliente: cliente,
            _id: _id,
            fecha: fecha,
            subtotal: subtotal,
            precio_envio: precio_envio
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'hjm.tienda.compra@gmail.com',
            to: venta.cliente.email,
            subject: 'Confirmación de pago, HJM',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const enviar_correo_enviado_admin = async function (req, res) {

    var id = req.params['id'];

    var data = req.body;

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'hjm.tienda.compra@gmail.com',
            pass: 'sxmmbvxebipxisbf'
        }
    }));

    //Datos de envío
    var empresa = data.empresa;
    var codigo = data.codigo;
    var clave = data.clave;

    //cliente _id fecha data subtotal
    var venta = await Venta.findById({ _id: id }).populate('cliente');
    var detalles = await Dventa.find({ venta: id }).populate('producto');

    var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    var _id = venta._id.toString().toUpperCase();
    var fecha = new Date(venta.createdAt);
    var data = detalles;
    var subtotal = venta.subtotal;
    var precio_envio = venta.envio_precio;

    readHTMLFile(process.cwd() + '/mail-enviado.html', (err, html) => {

        let rest_html = ejs.render(html, {
            data: data,
            cliente: cliente,
            _id: _id,
            fecha: fecha,
            subtotal: subtotal,
            precio_envio: precio_envio,
            empresa: empresa,
            codigo: codigo,
            clave: clave
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'hjm.tienda.compra@gmail.com',
            to: venta.cliente.email,
            subject: 'TU compra fue enviada!!!',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const enviar_correo_recepcion_admin = async function (req, res) {

    var id = req.params['id'];

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'hjm.tienda.compra@gmail.com',
            pass: 'sxmmbvxebipxisbf'
        }
    }));

    //cliente _id fecha data subtotal

    var venta = await Venta.findById({ _id: id }).populate('cliente');
    var detalles = await Dventa.find({ venta: id }).populate('producto');

    var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    var _id = venta._id.toString().toUpperCase();
    var fecha = new Date(venta.createdAt);
    var data = detalles;
    var subtotal = venta.subtotal;
    var precio_envio = venta.envio_precio;

    readHTMLFile(process.cwd() + '/mail-reception.html', (err, html) => {

        let rest_html = ejs.render(html, {
            data: data,
            cliente: cliente,
            _id: _id,
            fecha: fecha,
            subtotal: subtotal,
            precio_envio: precio_envio
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'hjm.tienda.compra@gmail.com',
            to: venta.cliente.email,
            subject: 'Recepción de pedido!!!',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

module.exports = {
    registro_compra_cliente,
    registro_compra_software,
    registro_reservacion_cliente,
    registro_reservacion_software_cliente,
    actualizar_venta_software_descargado,
    eliminar_reservacion_admin,
    enviar_correo_reservacion_cliente,
    enviar_correo_cliente,
    enviar_correo_confirmacion_admin,
    enviar_correo_enviado_admin,
    enviar_correo_recepcion_admin
}