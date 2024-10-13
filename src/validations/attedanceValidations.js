import Joi from 'joi';

const attedanceSchema = {
  setAttendance : Joi.object({
      attedance: Joi.string()
        .valid('Hadir', 'Pulang')
        .required()
        .messages({
          'string.base': 'Attendance status must be a string.',
          'any.only': 'Attendance status must be either "Hadir" or "Pulang".',
          'any.required': 'Attendance status is required.'
        }),
    
      latitude: Joi.number()
        .min(-90).max(90)
        .required()
        .messages({
          'number.base': 'Latitude must be a valid number.',
          'number.min': 'Latitude cannot be less than -90.',
          'number.max': 'Latitude cannot be greater than 90.',
          'any.required': 'Latitude is required.'
        }),
    
      longitude: Joi.number()
        .min(-180).max(180)
        .required()
        .messages({
          'number.base': 'Longitude must be a valid number.',
          'number.min': 'Longitude cannot be less than -180.',
          'number.max': 'Longitude cannot be greater than 180.',
          'any.required': 'Longitude is required.'
        })
    }),
  getAttedance : Joi.object({
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
  getPIC : Joi.object({
    day: Joi.date()
    .iso()
    .messages({
      'date.base': 'Day must be a valid date.',
      'date.format': 'Day must be in (YYYY-MM-DD) format.' 
    }),
  }),
  getSPV : Joi.object({
    day: Joi.date()
    .iso()
    .messages({
      'date.base': 'Day must be a valid date.',
      'date.format': 'Day must be in (YYYY-MM-DD) format.' 
    }), 
  }),
}

export { attedanceSchema };