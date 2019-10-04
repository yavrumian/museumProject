const fs = require('fs'),
	path = require('path')

var	imgFormat,
	base64img,
	imgUrl,
	audioUrl,
	img,
	audio,
	oldImg,
	oldAudio

module.exports = (body, old) => {
	if(old){
		oldImg =  path.join(__dirname, `../../public/img/${old.image}`)
		fs.unlink(oldImg, (err) => {if(err) throw err})
		oldAudio =  path.join(__dirname, `../../public/audio/${old.audio}`)
		fs.unlink(oldAudio, (err) => {if(err) throw err})
	}
	if(body.image){
		imgFormat = body.image.trim().substr(11, 3)
		base64img = body.image.split(';base64,').pop()
		imgUrl = path.join(__dirname, `../../public/img/${body.lang}${body.id}.${imgFormat}`)
		img = `${body.lang}${body.id}.${imgFormat}`
		console.log(img);
		fs.writeFile(imgUrl, base64img, {encoding: 'base64'}, function(err) {
			if(err) throw err
		});
	}else img = null

	if(body.audio){
		audioUrl = path.join(__dirname, `../../public/audio/${body.lang}${body.id}.mp3`)
		audio = `${body.lang}${body.id}.mp3`
		fs.writeFile(audioUrl, body.audio, {encoding: 'base64'}, function(err) {
			if(err) throw err
		});
	}else audio = null

	return {imgUrl: img, audioUrl: audio}
}
