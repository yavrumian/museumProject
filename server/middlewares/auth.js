exports.auth = (req, res, next) => {
	if(req.session.isLogged == true) next()
	else res.status(401).end('You\'re not logged in')

}
