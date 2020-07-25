const passport = require('passport');

module.exports = {
	isLoggedIn(req, res, next){
		// Metodo de passport que valida si existe la sesion del usuario
		// Proteger la ruta profile
		if(req.isAuthenticated){
			return next();
		}
		return res.redirect('/signin');
	}

/*
	registerHelper('for',function(from,to,incr,user){
		for(var i = from; i<to; i+=incr)
			acumm += block.fn(i);
		return accum;
	});
*/

};
