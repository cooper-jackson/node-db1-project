const router = require('express').Router()
const Accounts = require('./accounts-model')
const md = require('./accounts-middleware')
const db = require('../../data/db-config')


router.get('/',  async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const accounts = await Accounts.getAll()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', md.checkAccountId,  async (req, res, next) => {
  // DO YOUR MAGIC
  res.json(req.account)
})

router.post('/', md.checkAccountPayload, md.checkAccountNameUnique, async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const newAccount = await Accounts.create(req.body)
    res.json(newAccount)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', md.checkAccountId, md.checkAccountPayload, md.checkAccountNameUnique, async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const updatedAccount = await Accounts.updateById(req.params.id, req.body)
    res.status(200).json(updatedAccount)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', md.checkAccountPayload, async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    await Accounts.deleteById(req.params.id)
    res.json(req.account)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  // DO YOUR MAGIC
  res.status(err.status || 500).json({
    message: err.message
  })
})

module.exports = router;
