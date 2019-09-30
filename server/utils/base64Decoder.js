const fs = require('fs'),
	path = require('path')

var	imgFormat,
	base64img,
	imgUrl,
	audioUrl

module.exports = (body) => {
	imgFormat = body.image.trim().substring(11, 13)
	base64img = body.image.split(';base64,').pop()
	imgUrl = path.join(__dirname, `../../public/img/${body.lang}${body.id}.${imgFormat}`)
	audioUrl = path.join(__dirname, `../../public/audio/${body.lang}${body.id}.mp3`)

	//Fetch images, decode from base64, save the URL
	fs.writeFile(imgUrl, base64img, {encoding: 'base64'}, function(err) {
		if(err) throw err
	});
	fs.writeFile(audioUrl, body.audio, {encoding: 'base64'}, function(err) {
		if(err) throw err
	});

	return {imgUrl: `${body.lang}${body.id}.${imgFormat}`, audioUrl: `${body.lang}${body.id}.mp3`}
}
