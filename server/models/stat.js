const mongoose = require('mongoose'),
	Schema = mongoose.Schema



const statSchema = new Schema({
	createdAt: {type: Date, required: true, default: Date.now}
})


const Stat = mongoose.model('Stat', statSchema)

module.exports = {Stat}
