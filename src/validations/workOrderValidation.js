import Joi from 'joi';

const workOrderSchema = {
  setWorkOrder: Joi.object({
    workOrder: Joi.string()
      .required()
      .max(255)
      .messages({
        'string.empty': 'Nama pekerjaan wajib diisi.',
        'string.max': 'Nama pekerjaan tidak boleh melebihi 255 karakter.',
        'any.required': 'Nama pekerjaan wajib diisi.'
      }),
    
    description: Joi.string()
      .required()
      .max(1000)
      .messages({
        'string.empty': 'Rincian pekerjaan tidak boleh kosong.',
        'string.max': 'Rincian pekerjaan tidak boleh melebihi 1000 karakter.',
        'any.required': 'Rincian pekerjaan wajib diisi.'
      }),
    
    start_work: Joi.date()
      .iso()
      .required()
      .messages({
        'date.base': 'Estimasi waktu mulai tanggal harus berupa tanggal yang valid.', 
        'date.format': 'Estimasi waktu mulai tanggal harus dalam format (YYYY-MM-DD).', 
        'any.required': 'Estimasi waktu mulai tanggal diperlukan.' 
      }), 
    end_work: Joi.date()
      .iso()
      .min(Joi.ref('start_work'))
      .required()
      .messages({ 
        'date.base': 'Esti masi waktu selesai harus berupa tanggal yang valid.', 
        'date.format': 'Estimasi waktu selesai harus dalam format (YYYY-MM-DD).', 
        'date.min': 'Estimasi waktu selesai harus setelah atau sama dengan tanggal mulai kerja.', 
        'any.required': 'Estimasi waktu selesai diperlukan.' 
      }),
    
    notes: Joi.string()
      .allow('')
      .max(255)
      .messages({
        'string.max': 'Komentar/Catatan tidak boleh melebihi 255 karakter.'
      })
  }),
  getWorkOrders : Joi.object({
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
          'any.default': 'Limit size defaults to 10 if not provided.'
        })
  }),
  getWorkOrderById: Joi.object({
    id: Joi.string()
      .pattern(/^WO-\d+$/)
      .required()
      .messages({
        'string.empty': 'ID is required.',
        'string.pattern.base': 'ID must be in the format WO-<number>.',
        'any.required' : 'ID is required.'
      })
  }),
  approveWorkOrder: Joi.object({
      id: Joi.string()
        .pattern(/^WO-\d+$/)
        .required()
        .messages({
          'string.empty': 'ID is required.',
          'string.pattern.base': 'ID must be in the format WO-<number>.',
          'any.required' : 'ID is required.'
        }),
      approve: Joi.string()
        .valid('Approved', 'Rejected')
        .required()
        .messages({
          'string.base': 'Approve status must be a string.',
          'any.only': 'Approve status must be either "Approved" or "Rejected".',
          'any.required': 'Approve status is required.'
        }),
  })
}

export { workOrderSchema };