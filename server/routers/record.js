const router = require('express').Router(),
	{check} = require('express-validator'),

	{auth} = require('../middlewares/auth')
	controller = require('../controllers/record')

router.post('/add', auth, check('title')
					.isLength({min:5})
					.withMessage({type: 'rec-validation', msg: 'Title must be at least 5 character length'}),
				check('image')
					.isLength({min:1})
					.withMessage({type:'rec-validation', msg: 'This field can not be empty'}),
				check('audio')
					.isLength({min:1})
					.withMessage({type:'rec-validation', msg: 'This field can not be empty'}),
				controller.add)

router.post('/edit/:id/:lang', auth, controller.edit)

router.get('/delete/:id/:lang', auth, controller.delete)

router.get('/:id/:lang', controller.get)

router.get('/all', controller.getAll)

module.exports = router
