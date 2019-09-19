const router = require('express').Router(),
	{check} = require('express-validator'),

	{authAdmin, authUser} = require('../middlewares/auth'),
	controller = require('../controllers/record')

router.post('/add', authAdmin, check('title')
					.isLength({min:5})
					.withMessage({type: 'rec-validation', msg: 'Title must be at least 5 character length'}),
				check('image')
					.isLength({min:1})
					.withMessage({type:'rec-validation', msg: 'This field can not be empty'}),
				check('audio')
					.isLength({min:1})
					.withMessage({type:'rec-validation', msg: 'This field can not be empty'}),
				controller.add)

router.post('/edit/:id/:lang', authAdmin, controller.edit)

router.get('/delete/:id/:lang', authAdmin, controller.delete)

router.get('/:id/:lang', authUser, controller.get)

router.get('/all', authUser, controller.getAll)

module.exports = router
