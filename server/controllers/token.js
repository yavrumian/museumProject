const id = require('random-id'),
	PDFdoc = require('pdfkit'),
	fs = require('fs'),
	path = require('path'),
	QRcode = require('qrcode'),
	{validationResult} = require('express-validator'),

	multSaver = require('../utils/multipleSaver'),

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
	const PDFsize = [parseFloat(process.env.PDF_WIDTH), parseFloat(process.env.PDF_HEIGTH)]
	const pdf = new PDFdoc({size: PDFsize, fontSize: 12, autoFirstPage: false});
	//define path to doc and create it
	const pdfName = id(5, '0aA')
	const pathToPDF = path.join(__dirname, `../../public/pdf/${pdfName}.pdf`)
	const urlToPDF = `${process.env.HOST}/pdf/${pdfName}.pdf`
	pdf.pipe(fs.createWriteStream(pathToPDF));

	//array to collect all docs and save it latter
	let allDocs = [];

	for(let i = 0; i < req.query.count; i++){
		//create token, define path to QR and text in qr
		const token = id(process.env.TOKEN_LEN, process.env.TOKEN_PATTERN)
		const pathToQR = path.join(__dirname, `../tmp/qr/${token}.png`)
		const textToQR = `${process.env.HOST}/token/${token}`

		//push doc to array
		allDocs.push(new Token({token}))

		try{
			//create QR file, add it to PDF
			await QRcode.toFile(pathToQR, textToQR)
			pdf.addPage()
				.text(textToQR)
				.image(pathToQR)
			//Delete QR file from tmp
			fs.unlink(pathToQR, (err) => {if(err) throw err})
		}catch(e){
			console.log(e);
			res.status(400).send(e)
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
