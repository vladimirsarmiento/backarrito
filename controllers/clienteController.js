'use strict';

var Cliente = require('../models/cliente');

var Venta = require('../models/venta');
var Dventa = require('../models/dventa');

var Cuenta = require('../models/cuenta');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Direccion = require('../models/direccion');

const registro_cliente = async function (req, res) {
  //Obtiene los parámetros del cliente
  var data = req.body;
  var clientes_arr = [];

  //Verifica que no exista correo repetido
  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    //Registro del usuario

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Cliente.create(data);
          res.status(200).send({
            data: reg,
            token: jwt.createToken(reg)
          });
        } else {
          res.status(200).send({ message: "Error server", data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: "No hay una contraseña", data: undefined });
    }
  } else {
    res
      .status(200)
      .send({
        message: "El correo ya existe en la Base de Datos",
        data: undefined,
      });
  }
};

const login_cliente = async function (req, res) {
  var data = req.body;
  var clientes_arr = [];

  //Busca un cliente mediante el correo
  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    res
      .status(200)
      .send({ message: "Correo o contraseña incorrectos", data: undefined });
  } else {
    //Si existe el cliente se manda al login
    let user = clientes_arr[0];

    //Comparar contraseñas
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "Correo o contraseña incorrectos", data: undefined });
      }
    });
  }
};

const listar_clientes_filtro_admin = async function (req, res) {

  if (req.user) {
    if (req.user.role == "admin") {

      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];

      console.log(tipo);

      if (tipo == null || tipo == "null") {
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      } else {
        if (tipo == "apellidos") {
          let reg = await Cliente.find({ apellidos: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        } else if (tipo == "correo") {
          let reg = await Cliente.find({ email: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        }
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
};

const registro_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin') {

      var data = req.body;

      bcrypt.hash('12345', null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          let reg = await Cliente.create(data);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: 'Error en el servidor', data: undefined });
        }
      })

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin') {

      var id = req.params['id'];

      try {
        var reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg });

      } catch (error) {
        res.status(200).send({ data: undefined });
      }

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_cliente = async function (req, res) {
  if (req.user) {

    var id = req.params['id'];

    try {
      var reg = await Cliente.findById({ _id: id });
      res.status(200).send({ data: reg });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const actualizar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin') {

      var id = req.params['id'];
      var data = req.body;

      var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero
      });

      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const eliminar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin') {

      var id = req.params['id'];
      let reg = await Cliente.findByIdAndRemove({ _id: id });
      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const actualizar_perfil_cliente = async function (req, res) {
  if (req.user) {

    var id = req.params['id']
    var data = req.body;

    //Cuando se manda una contraseña se debe encriptar
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
          nombres: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono,
          f_nacimiento: data.f_nacimiento,
          dni: data.dni,
          genero: data.genero,
          pais: data.pais,
          password: hash
        });

        res.status(200).send({ data: reg });
      });

      //No se manda una contraseña
    } else {
      console.log('SIN PASS');
      var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero,
        pais: data.pais
      });

      res.status(200).send({ data: reg });
    }


  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

/************************************************************************+*/
//Direcciones
const registro_direccion_cliente = async function (req, res) {
  if (req.user) {
    var data = req.body;

    if (data.principal) {
      let direcciones = await Direccion.find({ cliente: data.cliente });
      direcciones.forEach(async element => {
        await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
      });
    }

    let reg = await Direccion.create(data);

    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_direcciones_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    let direcciones = await Direccion.find({ cliente: id }).populate('cliente').sort({ createdAt: -1 });
    res.status(200).send({ data: direcciones });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_direccion_principal_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var direccion = undefined;

    direccion = await Direccion.findOne({ cliente: id, principal: true });

    if (direccion == undefined) {
      res.status(200).send({ data: undefined });
    } else {
      res.status(200).send({ data: direccion });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const cambiar_direccion_principal = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var cliente = req.params['cliente'];

    let direcciones = await Direccion.find({ cliente: cliente });
    direcciones.forEach(async element => {
      await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
    });

    await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });

    res.status(200).send({ data: true });

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const eliminar_direccion_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    await Direccion.findByIdAndRemove({ _id: id });

    res.status(200).send({ data: true });

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}


//////***********************************************************/ */ CONTACTO
const enviar_mensaje_contacto = async function (req, res) {
  let data = req.body;
  data.estado = 'Abierto';
  let reg = await Contacto.create(data);

  res.status(200).send({ data: reg })
}

///////////////////////ORDENES
const obtener_ordenes_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    var reg = await Venta.find({ cliente: id }).sort({ createdAt: -1 });
    if (reg.length >= 1) {
      res.status(200).send({ data: reg });

    } else if (reg.length == 0) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_detalles_orden_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    try {
      let venta = await Venta.findById({ _id: id }).populate('direccion').populate('cliente');
      let detalles = await Dventa.find({ venta: id }).populate('producto');

      res.status(200).send({ data: venta, detalles: detalles });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

//////////Ventas de Software///////////////////////
const obtener_ventas_software = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    var reg = await VentaSoftware.find({ cliente: id }).sort({ createdAt: -1 });

    if (reg.length >= 1) {
      res.status(200).send({ data: reg });

    } else if (reg.length == 0) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_detalles_venta_software = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    try {
      let venta = await VentaSoftware.findById({ _id: id }).populate('cliente').populate('software');

      res.status(200).send({ data: venta });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

//Reseñas
const emitir_review_producto_cliente = async function (req, res) {
  if (req.user) {
    let data = req.body;

    let reg = await Review.create(data);
    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_review_producto_cliente = async function (req, res) {
  let id = req.params['id'];

  let reg = await Review.find({ producto: id }).sort({ createdAt: -1 });
  res.status(200).send({ data: reg });
}

const obtener_reviews_cliente = async function (req, res) {
  if (req.user) {
    let id = req.params['id'];

    let reg = await Review.find({ cliente: id }).sort({ createdAt: -1 }).populate('cliente');
    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const actualizar_ventas_recibido = async function (req, res) {
  if (req.user) {

    let id = req.params['id'];
    let reg = await Venta.findByIdAndUpdate({ _id: id }, { estado: 'Recibido' });
    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}



////////Cuentas del back
const obtener_cuentas = async function (req, res) {
  if (req.user) {

    let cuentas = [];
    try {
      cuentas = await Cuenta.find();
      res.status(200).send({ data: cuentas });
    } catch (error) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,
  obtener_cliente,
  actualizar_perfil_cliente,
  registro_direccion_cliente,
  obtener_direcciones_cliente,
  cambiar_direccion_principal,
  eliminar_direccion_cliente,
  obtener_direccion_principal_cliente,
  enviar_mensaje_contacto,
  obtener_ordenes_cliente,
  obtener_detalles_orden_cliente,
  obtener_ventas_software,
  obtener_detalles_venta_software,
  emitir_review_producto_cliente,
  obtener_review_producto_cliente,
  obtener_reviews_cliente,
  actualizar_ventas_recibido,
  obtener_cuentas
};
