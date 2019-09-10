const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const lengthValidator = (value) => {
	if(value && value.toString.length == 9)	return true
	return false
}

const tokenSchema = new Schema({
	token: {type: Number, required: true, validate: lengthValidator, unique: true},
	createdAt: {type: Date, required: true, default: Date.now},
	ipAdress: String,
	expireAt: {type: Date, default: undefined}
})

tokenSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema)

module.exports = {Token}
