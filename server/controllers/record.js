const _ = require('lodash'),
	path = require('path'),
	fs = require('fs'),
	{validationResult} = require('express-validator'),
	base64toFile = require('../utils/base64Decoder'),
	formatter = require('../utils/urlFormatter'),

	{Record} = require('../models/record');

exports.add = async(req, res) => {

	//Get errors from express-validator
	const errors = validationResult(req);

	try{
		//throw errors if exists any
		if(!errors.isEmpty())
			throw errors.array()

		const decoderBody = _.pick(req.body, ['image', 'audio', 'lang', 'id'])
		const urls = base64toFile(decoderBody)
		req.body.image = urls.imgUrl
		req.body.audio = urls.audioUrl

		//pick values from request to avoid unwished data
		const body = _.pick(req.body, ['title', 'id', 'lang', 'description', 'audio', 'image'])

		//check if there's doc with given id and language and throw error
		const doc = await Record.find({id: body.id})
		if(doc[0] && doc[0].lang == body.lang) throw {code:11000, msg:'There\'s a record with given id and language'}

		//create new doc and save it
		const rec = new Record(body)
		await rec.save()
		const formated = formatter(rec.image, rec.audio)
		rec.image = formated.img
		rec.audio = formated.audio
		res.send(doc)
	}catch(e){
		console.log(e);

		res.status(400).send(e)
	}
}

exports.edit = async(req, res) => {
	req.body.id = req.params.id
	req.body.lang = req.params.lang
	//seperate data for base64 decoder
	const decoderBody = _.pick(req.body, ['image', 'audio', 'lang', 'id'])

	//decode image and audio from base64 and save urls
	const urls = base64toFile(decoderBody)
	req.body.image = urls.imgUrl
	req.body.audio = urls.audioUrl

	//pick values from request to avoid unwished data
	const body = _.pick(req.body, ['title', 'description', 'audio', 'image'])
	try{
		const doc = await Record.findOneAndUpdate({id: req.params.id, lang: req.params.lang }, {$set: body}, {new: true})
		if(!doc) throw 'No record found with given ID and language'
		const formated = formatter(doc.image, doc.audio)
		doc.image = formated.img
		doc.audio = formated.audio
		res.send(doc)
	}catch(e){
		console.log(e);
		res.status(404).send(e)
	}
}

exports.delete = async(req, res) => {
	//fetch record id and language
	const id = req.params.id,
		lang = req.params.lang

	try {
		//Delete record from DB, throw err if there is no any
		const doc = await Record.findOneAndDelete({id, lang})
		if(!doc) throw 'No record found with given ID and language'

		//Delete record's audio and image files from server
		const imageUrl = path.join(__dirname, `../../public/img/${doc.image}`)
		const audioUrl = path.join(__dirname, `../../public/audio/${doc.audio}`)
		fs.unlink(imageUrl, (err) => {if(err) throw err})
		fs.unlink(audioUrl, (err) => {if(err) throw err})
		const formated = formatter(doc.image, doc.audio)
		doc.image = formated.img
		doc.audio = formated.audio
		res.send(doc)
	} catch(e) {
		console.log(e);
		res.status(400).send(e)
	}
}

exports.get = async(req, res) => {
	const id = req.params.id,
		lang = req.params.lang
	 try{
		const doc = await Record.findOne({id, lang})
		if(!doc) throw 'No record is found with given ID ang language'

		const formated = formatter(doc.image, doc.audio)
		doc.image = formated.img
		doc.audio = formated.audio
		res.send(doc)
	 }catch(e){
		 console.log(e);
		 res.status(404).send(e)
	 }
}

exports.getAll = async(req, res) => {
	try{
		const doc = await Record.find()
		if(!doc[0]) throw 'There are no records in DB'
		for(record of doc){
						let formated = formatter(record.image, record.audio)
			record.image = formated.img
			record.audio = formated.audio
		}
		res.send(doc)
	}catch(e){
		console.log(e);
		res.status(400).send(e)
	}
}
