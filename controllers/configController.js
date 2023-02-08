var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const actualizar_config_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            let data = req.body;

            if (req.files) {
                //Hay imagen
                console.log('HAY IMAGEN');
                var img_path = req.files.logo.path;
                var name = img_path.split('/');
                var logo_name = name[2];

                let reg = await Config.findByIdAndUpdate({ _id: '63cecff6b6a93acc3ddbbc75' }, {
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    tipo_cambio: data.tipo_cambio,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo,
                    mision: data.mision,
                    vision: data.vision,
                    term_cond: data.term_cond,
                    politica_privacidad: data.politica_privacidad
                });

                fs.stat('./uploads/configs/' + reg.logo, function (err) {
                    if (!err) {
                        fs.unlink('./uploads/configs/' + reg.logo, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({ data: reg });

            } else {
                //NO hay imagen
                console.log('NO IMG');
                let reg = await Config.findByIdAndUpdate({ _id: '63cecff6b6a93acc3ddbbc75' }, {
                    categorias: data.categorias,
                    titulo: data.titulo,
                    tipo_cambio: data.tipo_cambio,
                    serie: data.serie,
                    correlativo: data.correlativo,
                    mision: data.mision,
                    vision: data.vision,
                    term_cond: data.term_cond,
                    politica_privacidad: data.politica_privacidad
                });

                res.status(200).send({ data: reg });
            }

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_imagen_banner_admin = async function (req, res) {

    if (req.user) {
        if (req.user.role == 'admin') {

            let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('/');
            var imagen_name = name[2];

            let reg = await Config.findByIdAndUpdate({ _id: id }, {
                $push: {
                    banners: {
                        imagen: imagen_name,
                        _id: data._id
                    }
                }
            });

            res.status(200).send({ data: reg });


        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_imagen_banner_admin = async function (req, res) {

    if (req.user) {
        if (req.user.role == 'admin') {

            let id = req.params['id'];
            let data = req.body;



            let reg = await Config.findByIdAndUpdate({ _id: id }, {
                $pull: {
                    banners: { _id: data._id }
                }
            });

            res.status(200).send({ data: reg });


        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_config_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            let reg = await Config.findById({ _id: '63cecff6b6a93acc3ddbbc75' });

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_logo = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/configs/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/configs/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_config_publico = async function (req, res) {
    let reg = await Config.findById({ _id: '63cecff6b6a93acc3ddbbc75' });
    res.status(200).send({ data: reg });
}

//Método público
const obtener_banner = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/configs/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/configs/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico,
    agregar_imagen_banner_admin,
    obtener_banner,
    eliminar_imagen_banner_admin
}