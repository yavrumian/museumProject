module.exports = (img, audio) => {
	img = `${process.env.HOST}/img/record/${img}`
	audio = `${process.env.HOST}/audio/${audio}`
	return {img, audio}
}
