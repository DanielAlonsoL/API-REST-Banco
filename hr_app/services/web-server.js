const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const clientes = require('../db_apis/clientes.js');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
	
	//inicializa y almacena en objeto app
    const app = express();
    require('./lib/passport');

	//crea un servidor y lo almacena en httpServer
    httpServer = http.createServer(app);

	//Senttings
  // Necesario para obtener vistas hacia los usuarios
	app.set('views','./views');

	app.engine('.hbs', exphbs({
		defaultLayaout: 'main',
		layaoutsDir: path.join(app.get('views'),'layaouts'),
		partialsDir: path.join(app.get('views'),'partials'),
		extname: '.hbs'
	}));

  // Vistas con archivos de extension handlebars
  app.set('view engine','.hbs');

	// Middleware
    app.use(session({
      secret: 'Oraclenodesession',
      resave: true,
      saveUninitialized: true
    }));
    app.use(flash());
    app.use(morgan('combined'));
    app.use(express.urlencoded({extended: false})); //aceptar nombres de los formularios
    app.use(express.json()); //enviar paquetes json
    app.use(passport.initialize());
    app.use(passport.session());

    // Gloabl Variables
    app.use((req, res, next) => {
      app.locals.success = req.flash('success');
      app.locals.message = req.flash('message');
      app.locals.user = req.user;
      next();
    });

    // Routes
    app.use('/',require('./routes/autentication')); //todas las rutas empiezan con / e inicia con el login

    // Public
    app.use(express.static(path.join(__dirname,'public')));

    //escucha solicitdes del listener del servidor web
    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });


}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;

