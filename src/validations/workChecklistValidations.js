import Joi from 'joi';

const workChecklistSchema = {
    checkWorkChecklist : Joi.object({
        work_id: Joi.string()
        .pattern(/^WO-\d+$/)
        .required()
        .messages({
          'string.empty': 'ID is required.',
          'string.pattern.base': 'ID must be in the format WO-<number>.',
          'any.required' : 'ID is required.'
        }),
        evaluations: Joi.object()
        .required()
        .messages({
          'object.base': 'evaluation must be a valid JSON object',
          'any.required': 'evaluation is required'
        })
    })
}

export { workChecklistSchema }