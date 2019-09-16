// module.exports = {
// 	addMult:  async function adder (arr) {
// 		let count = arr.length;
// 		const doc = arr.pop()
// 		try{
// 			await doc.save()
// 			if(--count) this.adder(arr)
// 			else console.log('All Right');
// 		}catch(e){
// 			throw e
// 		}
// 	}
// }

const addMult = async(arr) => {
	let count = arr.length;
	const doc = arr.pop()
	try{
		await doc.save()
		if(--count) addMult(arr)
	}catch(e){
		throw e
	}
}

module.exports = addMult
