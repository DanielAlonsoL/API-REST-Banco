const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const baseQuery = 
 `select banco_id "id",
    nombre "Nombre",
    clave "Clave",
    direccion_fiscal "Direccion"
  from banco`;
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.banco_id = context.id;
 
    query += `\nwhere banco_id = :banco_id`;
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;

const createSql =
 `insert into banco (
    nombre,
    clave,
    direccion_fiscal
   ) values (
    :nombre,
    :clave,
    :direccion_fiscal
  ) returning banco_id
  into :banco_id`;

async function create(ban) {
  const banco = Object.assign({}, ban);

  banco.banco_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }

  const result = await database.simpleExecute(createSql, banco);

  banco.banco_id = result.outBinds.banco_id[0];

  return banco;
}

module.exports.create = create;

const updateSql =
 `update banco
  set nombre  = :nombre,
    clave = :clave,
    direccion_fiscal = :direccion_fiscal
  where banco_id = :banco_id`;

async function update(ban) {
  const banco = Object.assign({}, ban);
  const result = await database.simpleExecute(updateSql, banco);

  if (result.rowsAffected && result.rowsAffected === 1) {
    return banco;
  } else {
    return null;
  }
}

module.exports.update = update;

const deleteSql =
 `begin
    delete from banco
    where banco_id = :banco_id;
    :rowcount := sql%rowcount;
  end;`

async function del(id) {
  const binds = {
    banco_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;
