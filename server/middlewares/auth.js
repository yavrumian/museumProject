exports.authAdmin = (req, res, next) => {
	if(req.session.isLogged) next()
	else res.status(401).end('You\'re not logged in')

}

exports.authUser = (req, res, next) => {
	if(req.session.isLogged || req.session.token) next()
	else res.status(401).end('Authentication error, login as admin or validate token to continue')
}
