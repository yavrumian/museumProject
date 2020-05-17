const express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	path = require('path'),
	cron = require('node-cron'),
	fs = require('fs-extra'),
	cors = require('cors'),
	{mongoose} = require('./db/mongoose'),

	request = require('request-promise'),
	{Stat} = require('./models/stat'),

	app = express(),
	port = process.env.PORT

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(session({
		secret:process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {maxAge: process.env.COOKIE_LIFE*3600*1000}
	}))
app.use(`/${process.env.PREFIX}/`, express.static(path.join(__dirname, '../public')))
app.use(`/${process.env.PREFIX}/record`, require('./routers/record'))
app.use(`/${process.env.PREFIX}/token`, require('./routers/token'))
app.use(cors())

app.post(`/${process.env.PREFIX}/login`, (req, res) => {
	if(req.body.username == process.env.LOGIN && req.body.pass == process.env.PASS){
		req.session.isLogged = true
		res.send({status: 'success', msg:'You\'re logged in'})
	}
	else res.status(401).send({status: 'failed', msg:'Invalid username and/or password'})
})

app.get(`/${process.env.PREFIX}/logout`, (req, res) => {
	if(req.session.isLogged) {
		req.session.isLogged = false;
		res.send({status: 'success', msg:'You\'re logged out'})
	}else res.send({status: 'failed', msg:'You\'re not logged in'})
})

app.get(`/${process.env.PREFIX}/checkLogin`, (req, res) => {
	if(req.session.isLogged)	res.send({msg:'You\'re logged in'})
	else res.send({msg:'You\'re not logged in'})
})

app.get(`/${process.env.PREFIX}/checkToken`, (req, res) => {
	if(req.session.token) res.send({msg:'You\'re logged in with token'})
	else res.send({msg:'No token is provided'})
})

app.get(`/${process.env.PREFIX}/getLangs`, (req, res) => {
	res.send({langs: process.env.LANGS.split(',')})

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

// cron.schedule(process.env.STAT_SEND_TIME, async() => {
// 	try{
// 		const stats = await Stat.find({})
// 		if(!stats[0]) throw 'no stats'
//
// 		const response = await request(`http://${process.env.ADMIN_SERVER}/`)
// 		if(response.statusCode == 400) throw response.body
//
// 		console.log('Sending statistics to admin server...');
//
// 		for (var i = 0; i < stats.length; i++) {
// 			await request({
// 				method: 'POST',
// 				json: true,
// 				uri: `http://${process.env.ADMIN_SERVER}/newStat?id=${process.env.ID}`,
// 				body: {createdAt: stats[i].createdAt}
// 			})
//
// 			await Stat.findOneAndDelete({_id: stats[i]._id})
// 		}
// 		console.log('Statistics successfully sent to admin server');
// 	}catch(e){
// 		console.log();
// 	}
// })

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})
