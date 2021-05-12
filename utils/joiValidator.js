const Joi = require('joi')
const registerSchema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
    city: Joi.string().min(3).max(30).required(),
    dob: Joi.string().required(),
  })

module.exports = registerSchema        


