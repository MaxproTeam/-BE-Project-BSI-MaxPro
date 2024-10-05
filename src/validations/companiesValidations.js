import Joi from 'joi';

const companiesSchema = {
  getCompanies : Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
          'number.base': 'Page must be a number.',
          'number.integer': 'Page must be an integer.',
          'number.min': 'Page must be at least 1.',
          'any.default': 'Page defaults to 1 if not provided.'
        }),
      
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
          'number.base': 'Limit must be a number.',
          'number.integer': 'Limit must be an integer.',
          'number.min': 'Limit must be at least 1.',
          'number.max': 'Limit must be at most 100.',
          'any.default': 'Limit defaults to 10 if not provided.'
        }),
  }),
  getCompaniesById : Joi.object({
    id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.required' : 'ID is required.',
      'number.base': 'ID must be a number.',
      'number.integer': 'ID must be an integer.',
      'any.required' : 'ID is required.'
    }),
  })
}

export { companiesSchema };