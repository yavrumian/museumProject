const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const recordSchema = new Schema({
	title: {type: String, unique: true, required: true},
	id: {type: Number, required: true},
	lang: {type: Number, required: true},
	description: {type: String, required: true},
	audio: String,
	image: String,
	createdAt: {type: Date, required: true}
})

const Record = mongoose.model('Record', recordSchema)

module.exports = {Record}
