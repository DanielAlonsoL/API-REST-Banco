const oracledb = require('oracledb');
const database = require('../services/database.js'); 

const baseQuery = 
 `select c.cliente_id "id",
    c.nombre "nombre",
    c.apellido_paterno "apellido_paterno",
    c.apellido_materno "apellido_materno",
    c.correo_electronico "correo_electronico",
    c.password "password",
	c.rfc "rfc",
	c.direccion "direccion",
	t.num_tarjeta "num_tarjeta",
	t.mes_exp "mes_exp",
	t.año_exp "año_exp",
	t.fecha_aprobacion "fecha_aprobacion",
	tt.descripcion "descripcion",
	cu.clabe "clabe",
	cu.titular_id "titular"
  from cliente c, cuenta cu, tarjeta t, tipo_tarjeta tt
  where c.cliente_id = cu.cliente_id
    and t.tarjeta_id = cu.tarjeta_id
    and tt.tipo_tarjeta_id = t.tipo_tarjeta_id`;

const baseQuery2 = 
	`select c.nombre "titular_nombre",
	c.apellido_paterno "titular_apellido_paterno",
	c.apellido_materno "titular_apellido_materno"
  from cliente c, cuenta cu`;

const baseQuery3 =
	`select c.nombre "nombre",
    t.num_tarjeta "num_tarjeta", 
	t.mes_exp "mes_exp", 
	t.año_exp "año_exp",
    tt.descripcion "descripcion"
  from cuenta cu,tarjeta t, cliente c, tipo_tarjeta tt
  where cu.cliente_id=c.cliente_id
 	and cu.tarjeta_id=t.tarjeta_id
	and tt.tipo_tarjeta_id=t.tipo_tarjeta_id`;

const pwdQuery = 
   `select password "password"
  from cliente`;
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.correo_electronico) {
    binds.correo_electronico = context.correo_electronico;
 
    query += `\nand c.correo_electronico = :correo_electronico`;
  }
 
  const result = await database.simpleExecute(query, binds);
  return result.rows;
}
 
module.exports.find = find;

async function findTitular(context2) {
  let query = baseQuery2;
  const binds = {};
 
  if (context2.titular_id) {
    binds.titular_id = context2.titular_id;
 
    query += `\nwhere c.cliente_id = :titular_id`;
  }
 
  const result = await database.simpleExecute(query,binds);
  return result.rows
}
 
module.exports.findTitular = findTitular;

async function findTarjeta(context3) {
  let query = baseQuery3;
  const binds = {};
 
  if (context3.cliente_id) {
    binds.cliente_id = context3.cliente_id;
 
    query += `\nand cu.cliente_id=:cliente_id`;
  }
 
  const result = await database.simpleExecute(query,binds);
  return result.rows
}
 
module.exports.findTarjeta = findTarjeta;

async function getPass(context) {
  let query = pwdQuery;
  const binds = {};
 
  if (context.correo_electronico) {
    binds.correo_electronico = context.correo_electronico;
 
    query += `\nwhere correo_electronico = :correo_electronico`;
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}

module.exports.getPass = getPass;


