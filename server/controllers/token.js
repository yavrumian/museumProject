const id = require('random-id'),
	PDFdoc = require('pdfkit'),
	fs = require('fs'),
	path = require('path'),
	QRcode = require('qrcode'),
	request = require('request-promise'),
	{validationResult} = require('express-validator'),

	multSaver = require('../utils/multipleSaver'),

	{Token} = require('../models/token'),
	{Stat} = require('../models/stat')

exports.create = async(req, res) => {
	//Get errors from express-validator and throw if there're any
	try{
		const err = validationResult(req)
		if(!err.isEmpty()) throw err.array()
	}catch(e){
		console.log(e);
		res.send(e)
	}

	//define PDF doc and initilize options
	const PDFsize = [parseFloat(process.env.PDF_WIDTH), parseFloat(process.env.PDF_HEIGTH)]
	const pdf = new PDFdoc({size: PDFsize, fontSize: 12, autoFirstPage: false, margin: 0});
	//define path to doc and create it
	const pdfName = id(5, '0aA')
	const pathToPDF = path.join(__dirname, `../../public/pdf/${pdfName}.pdf`)
	const urlToPDF = `http://${process.env.HOST}/pdf/${pdfName}.pdf`
	pdf.pipe(fs.createWriteStream(pathToPDF));

	//array to collect all docs and save it latter
	let allDocs = [];

	for(let i = 0; i < req.query.count; i++){
		//create token, define path to QR and text in qr
		const token = id(process.env.TOKEN_LEN, process.env.TOKEN_PATTERN)
		const pathToQR = path.join(__dirname, `../tmp/qr/${token}.png`)
		const textToQR = `${process.env.HOST}/token?token=${token}&source=qr`
		const pathToLogo = path.join(__dirname, '../img/logo.jpg')

		//push doc to array
		allDocs.push(new Token({token}))

		try{
			//create QR file, add it to PDF
			await QRcode.toFile(pathToQR, textToQR)
			pdf.addPage()
				.image(pathToLogo, 0, 0, {fit:[227, 60], align: 'center'})
				.text('Museum Name', {align: 'center'})
				.image(pathToQR, 0, 81, {fit:[227, 160], align: 'center'})
				.fontSize(8)
				.fillColor('grey')
				.text('If you have any issues with QR code, please visit', 0, 240, {align: 'center'})
				// .text(' ')
				.fontSize(10)
				.fillColor('black')
				.text(`${process.env.HOST}/`, {lineBrak: false, align: 'center'})
				.text(' ')
				.fontSize(8)
				.fillColor('grey')
				.text('and enter your token', {align: 'center'})
				// .text(' ')
				.fontSize(10)
				.fillColor('black')
				.text(`${token}`, {lineBrak: false, align: 'center'})
			//Delete QR file from tmp
			fs.unlink(pathToQR, (err) => {if(err) throw err})
		}catch(e){
			console.log(e);
			return res.status(400).send(e)
		}
	}
	try{
		multSaver(allDocs)
		pdf.end()
		res.send({urlToPDF})
	}catch(e){
		console.log(e);
		res.status(400).send(e)
	}


}

exports.validate = async(req, res) => {
	try{
		//check for validator errors, throw if any is found
		const err = validationResult(req)
		if(!err.isEmpty()) throw (err.array())

		//fetch token from query, throw if not found or already used
		const token = req.query.token;
		const doc = await Token.findOne({token})
		console.log(doc);
		console.log(!doc || doc.expireAt);
		if(!doc || doc.expireAt) {
			throw ({msg: 'Invalid Token'})}
		const expTime = Date.now() + (process.env.COOKIE_LIFE * 3600 * 1000)

		//set expireTime and save to DB
		doc.expireAt = expTime
		await doc.save()
		//set session.token for authentication
		req.session.token = token
		if(req.query.source == "qr") return res.redirect(`https://${process.env.HOST}/lang.html`)
		res.send({token: doc.token})
	}catch(e){
		console.log(e);
		if(e.message) e = {msg: e.message}
		return res.status(400).send(e)
	}
	// try{
	// 	//send request to admin server
	// 	const response = await request({
	// 		method: 'POST',
	// 		json: true,
	// 		uri: `http://${process.env.ADMIN_SERVER}/newStat?id=${process.env.ID}`,
	// 		body: {createdAt: Date.now()}
	// 	})
	// 	if(response.statusCode == 400) throw response.body
	// }catch(e){
	// 	try{
	// 		await new Stat({createdAt: Date.now()}).save()
	// 	}catch(e){
	// 		console.log(e);
	// 		return res.status(400).send()
	// 	}
	// 	console.log({name: e.name, msg: e.message});
	// }
}

exports.getActive = async(req, res) => {
	try{
		const active = await Token.countDocuments({expireAt: undefined})

		res.send({active})
	}catch(e){
		console.log(e);
		res.status(400).send(e)
	}
}
