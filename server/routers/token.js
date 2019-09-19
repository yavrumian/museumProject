const router = require('express').Router(),
	{query} = require('express-validator'),
	controller = require('../controllers/token'),
	{authAdmin} = require('../middlewares/auth')

router.get('/create', authAdmin, query('count')
					.isInt({min:1, max: 50})
					.withMessage('Count must be number from 1 to 50'),
 			controller.create)

router.get('/', query('token')
 				.isLength(process.env.TOKEN_LEN)
				.withMessage('Invalid Token'),
			controller.validate)

module.exports = router
