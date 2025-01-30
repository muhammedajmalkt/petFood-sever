const Joi=require("joi")

exports.productSchema=Joi.object({
    image:Joi.string().uri().message({
        "string.uri": "Image URL must be a valid URI",
    }),
    name:Joi.string().required().min(3).message({
        "string.empty": "Product name is required",
        "string.min": "Product name must be 3 characters"
    }),
    category: Joi.string().required().lowercase().messages({
        "string.empty": "Category is required",
    }),
   weight: Joi.string().required().messages({
       "any.required": "Weight is required",
    }),

    price: Joi.number().positive().required().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than 0",
        "any.required": "Price is required",
      }),
      
    stock:Joi.number().min(5).positive().message({
        "number.base": "Stock must be a number",
        "number.min": "Stock cannot be less than 5",
    }),
    description:Joi.string().max(500)


})