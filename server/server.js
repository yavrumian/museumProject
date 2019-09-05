const app = require('express')(),
	bodyParser = require('body-parser'),

	{mongoose} = require('./db/mongoose'),

	port = process.env.PORT

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




app.listen(port, () => {
	console.log(`Server working on port ${port}`);
})
