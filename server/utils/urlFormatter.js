module.exports = (img, audio) => {
	img = `${process.env.HOST}/img/${img}`
	audio = `${process.env.HOST}/audio/${audio}`
	return {img, audio}
}
