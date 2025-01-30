const Joi=require("joi")

exports.cartSchema=Joi.object({
    userId:Joi.string().required().message({
        'any.required': 'User ID is required'
    })

})