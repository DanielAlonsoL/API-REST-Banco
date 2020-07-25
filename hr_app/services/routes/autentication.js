const express = require('express');
const router = new express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/helpers.js');
var fs = require('fs');
var myCss = {
         style : fs.readFileSync('./public/css/main.css','utf8')
     };

// Ruta con formulario para logearse
router.get('/signin',(req,res)=>{
	res.render('auth/signin',{
       title: 'My Site',
       myCss: myCss
      });
});

// Redirecciona en caso fallido o correcto desde el login
router.post('/signin',(req,res,next)=>{
	passport.authenticate('local.signin',{
		successRedirect: '/profile',
		failureRedirect: '/signin',
		failureFlash: true
	})(req,res,next);
});

// Ruta que contiene el perfil de quien se ha logeado
router.get('/profile', isLoggedIn,(req,res)=>{
	res.render('partials/profile');

});

// Ruta que contiene informacion de contacto
router.get('/contact',(req,res)=>{
	res.render('partials/contact');
});

// Ruta que contiene informacion de tarjetas
router.get('/cards',(req,res)=>{
	res.render('partials/cards');
});

// Ruta para cerrar sesion
router.get('/logout',(req,res)=>{
	req.logOut();
	res.redirect('/signin');
});

module.exports = router;
