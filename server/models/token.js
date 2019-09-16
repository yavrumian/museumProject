const mongoose = require('mongoose'),
	Schema = mongoose.Schema



const tokenSchema = new Schema({
	token: {type: String, required: true, minLength: process.env.TOKEN_LEN, maxLength: process.env.TOKEN_LEN, unique: true},
	createdAt: {type: Date, required: true, default: Date.now},
	expireAt: {type: Date, default: undefined}
})

tokenSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema)

module.exports = {Token}
