const bancos = require('../db_apis/bancos.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await bancos.find(context);
 
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

function getBancoFromRec(req) {
  const banco = {
    nombre: req.body.nombre,
    clave: req.body.clave,
    direccion_fiscal: req.body.direccion_fiscal
  };

  return banco;
}

