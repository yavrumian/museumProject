const id = require('random-id'),
	PDFdoc = require('pdfkit'),
	fs = require('fs'),
	path = require('path'),
	QRcode = require('qrcode'),
	{validationResult} = require('express-validator'),

	{Token} = require('../models/token')

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
	const pdf = new PDFdoc({size: [250, 200], fontSize: 12});
	//define path to doc and create it
	const pathToPDF = path.join(__dirname, `../../public/pdf/${id(5, '0aA')}.pdf`)
	pdf.pipe(fs.createWriteStream(pathToPDF));

	for(let i = 0; i<= req.query.count; i++){
		const token = id(process.env.TOKEN_LEN, '0aA')
		const pathToQR = path.join(__dirname, `../temp/qr/${token}.png`)
		const textToQR = `${process.env.HOST}/token/${token}`
		try{
			await QRcode.toFile(pathToQR, textToQR)
			pdf.addPage()
				.text(textToQR)
				.image(pathToQR)
		}catch(e){
			console.log(e);
		}

	}
	pdf.end()
	res.end()

}
