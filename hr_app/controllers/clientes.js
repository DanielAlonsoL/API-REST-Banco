const clientes = require('../db_apis/clientes.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await clientes.find(context);
 
    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;

function getClienteFromRec(req) {
  const cliente = {
    nombre: req.body.nombre,
    apellido_paterno: req.body.apellido_paterno,
    apellido_materno: req.body.apellido_materno,
    correo_electronico: req.body.correo_electronico,
    rfc: req.body.rfc,
    password: req.body.password
  };

  return cliente;
}

module.exports.getClienteFromRec = getClienteFromRec;

