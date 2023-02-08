'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'H0K4w4Ti3nd4';

exports.auth = function(req, res, next) {

    if (!req.headers.authorization){
        return res.status(403).send({message: 'NoHeadersError'});
    }

    var token = req.headers.authorization.replace(/[""]+/g,'');

    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({message: 'Token no válido'});
    } else {
        try {
            var payload = jwt.decode(token, secret);

            if (payload.exp <= moment.unix()) {
                return res.status(403).send({message: 'TokenExpirado'});
            }
        } catch (error) {
            return res.status(403).send({message: 'Token no válido'});
        }
    }

    req.user = payload;

    next();
}