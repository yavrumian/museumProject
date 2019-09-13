const router = require('express').Router(),
	{query} = require('express-validator')
	controller = require('../controllers/token')

router.get('/create', query('count')
					.isInt({min:1, max: 50})
					.withMessage('Count must be number from 1 to 99'),
 			controller.create)

module.exports = router
