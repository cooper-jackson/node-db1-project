const accounts = require('./accounts-model')
const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  const { name, budget } = req.body
  try {
    if (!name || !budget || name === 'undefined' || budget === 'undefined') {
      res.status(400).json({message: 'name and budget are required'})
      next({status: 400})
    } else if (typeof(name) !== 'string') {
      res.status(400).json({message: 'name of account must be a string'})
      next({status: 400})
    } else if (name.trim() < 3 || name.trim() > 100) {
      res.status(400).json({message: 'name of account must be between 3 and 100'})
      next({status: 400})
    } else if (typeof(budget) !== 'number') {
      res.status(400).json({message: 'budget of account must be a number'})
      next({status: 400})
    } else if (budget < 0 || budget > 1000000) {
      res.status(400).json({message: 'budget of account is too large or too small'})
      next({status: 400})
    } else {
      next()
    }
  }
  catch (err) {
    next(err)
  }
  console.log('md.checkAccountPayload middleware')
  next()
}

exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  const { name } = req.body

  try {
    const oldName = await db('accounts').where('name', name)

    if(oldName) {
      next({status: 400, message: 'that name is taken'})
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }

  console.log('md.checkAccountNameUnique middleware')
  next()
}

exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const account = await accounts.getById(req.params.id)
    if(!account) {
      next({ status: 404, message: 'Not found!'})
    } else {
      req.account = account
      next()
    }
  }
  catch (err) {
    next(err)
  }
  console.log('md.checkAccountId middleware')
  next()
}
