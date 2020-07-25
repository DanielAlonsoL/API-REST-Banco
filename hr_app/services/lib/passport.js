const express = require('express');
const passport = require('passport');
const helpers = require('./helpers');
const LocalStrategy = require('passport-local').Strategy;
const clientes = require('../../db_apis/clientes.js');

passport.use('local.signin',new LocalStrategy({
	usernameField: 'correo_electronico',
	passwordField: 'password',
	passReqToCallback: true
}, async(req,correo_electronico,password,done)=>{

	const correo = {};
	correo.correo_electronico = req.body.correo_electronico;
	const usuario = await clientes.find(correo);
	
	console.log(usuario);
	req.body.nombre = usuario[0].nombre;
	req.body.apellido_paterno = usuario[0].apellido_paterno;
	req.body.apellido_materno = usuario[0].apellido_materno;
	req.body.rfc = usuario[0].rfc;
	req.body.direccion = usuario[0].direccion;
	req.body.clabe = usuario[0].clabe;

	const titular = {};
	titular.titular_id = usuario[0].titular;
	
	const titular_tarjeta = await clientes.findTitular(titular);
	req.body.titular_nombre = titular_tarjeta[0].titular_nombre;
	req.body.titular_apellido_paterno = titular_tarjeta[0].titular_apellido_paterno;
	req.body.titular_apellido_materno = titular_tarjeta[0].titular_apellido_materno;

	const tarjeta={};
	tarjeta.cliente_id=usuario[0].id;
	const cliente_tarjeta = await clientes.findTarjeta(tarjeta);
	console.log(cliente_tarjeta);
	
	var i;

	if(cliente_tarjeta.length > 0){
		for(i=0; i<cliente_tarjeta.length;i++){
			var num_tarjeta = 'num_tarjeta_'+i;
			var mes_exp = 'mes_exp_'+i;
			var año_exp = 'año_exp_'+i;
			var descripcion = 'descripcion_'+i;

			req.body[num_tarjeta] = cliente_tarjeta[i].num_tarjeta;
			req.body[mes_exp] = cliente_tarjeta[i].mes_exp;
			req.body[año_exp] = cliente_tarjeta[i].año_exp;
			req.body[descripcion] = cliente_tarjeta[i].descripcion;
			req.body.num_tarjetas = i;
		};
	};

	console.log(req.body);

	
	//Validamos que exista el usuario y además que tenga la contraseña correcta
	if(usuario.length > 0){
		/* 
		Para debugear:
		console.log('Un registro encontrado');
		console.log('Correo: '+req.body.correo_electronico);
		console.log('Password de usuario: '+usuario[0].password);
		console.log('Password guardado: '+password+'\n');
		*/
		if(req.body.password == usuario[0].password ){
			done(null,req.body,req.flash('success','Welcome '+ req.body.correo_electronico));
		} else{
			done(null,false, req.flash('message','Contraseña incorrecta'));
		}
	} else{
		done(null,false, req.flash('message','Correo electronico no existe'));
	}
}));

//inicializa la sesión del usuario
passport.serializeUser((user, done) => {
  done(null,user)
});

//finaliza la sesión del usuario
passport.deserializeUser((user, done) => {
  done(null, user);
});
