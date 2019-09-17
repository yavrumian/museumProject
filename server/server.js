const express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	path = require('path'),
	cron = require('node-cron'),
	fs = require('fs-extra'),
	{mongoose} = require('./db/mongoose'),


	app = express(),
	port = process.env.PORT

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
		secret:process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {maxAge: process.env.COOKIE_LIFE*3600*1000}
	}))
app.use(express.static(path.join(__dirname, '../public')))
app.use('/record', require('./routers/record'))
app.use('/token', require('./routers/token'))

app.post('/login', (req, res) => {
	console.log(req.body.username, process.env.LOGIN);
	if(req.body.username == process.env.LOGIN && req.body.pass == process.env.PASS){
		req.session.isLogged = true
		res.send('Logged in')
	 }
	else res.status(401).end('Failed to login')
})

app.get('/logout', (req, res) => {
	console.log(req.port);
	if(req.session.isLogged == true) {
		req.session.isLogged = false;
		res.send('Logged out')
	}else res.end('You\'re not logged in')
})

cron.schedule(process.env.PDF_DELETE_TIME, async() => {
	console.log('Deleting PDF files...');
	try{
		fs.emptyDir(path.join(__dirname, '../public/pdf'))
		console.log('PDF files deleted successfully');
	}catch(e){
		console.log('Problem occured while deleting PDF files, displaying error');
		console.log(e);
	}
})

app.listen(port, () => {
	console.log(`Server working on port ${port}`);
})
