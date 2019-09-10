const router = require('express').Router(),
	{check} = require('express-validator'),

	controller = require('../controllers/record')

router.post('/add', check('title')
							.isLength({min:5})
							.withMessage({type: 'rec-validation', msg: 'Title must be at least 5 character length'}),
						controller.addRecord)

router.post('/edit/:id/:lang', controller.editRecord)

router.get('/delete/:id/:lang', controller.deleteRecord)

module.exports = router
