import Joi from 'joi';

const workOrderSchema = {
  setWorkOrder: Joi.object({
    workOrder: Joi.string()
      .required()
      .max(1000)
      .messages({
        'string.empty': 'Nama pekerjaan wajib diisi.',
        'string.max': 'Nama pekerjaan tidak boleh melebihi 1000 karakter.',
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
    day: Joi.date()
      .iso()
      .messages({
        'date.base': 'Filter day must be a valid date.',
        'date.format': 'Filter day must be in (YYYY-MM-DD) format.' 
      }),
    filterDay: Joi.date()
      .iso()
      .messages({
        'date.base': 'Filter day must be a valid date.',
        'date.format': 'Filter day must be in (YYYY-MM-DD) format.' 
      }), 
    filter: Joi.string()
    .valid('semua', 'sudah-diperiksa', 'belum-diperiksa', 'belum-disetujui', 'ditolak', 'dipending', 'sudah-ditugaskan', 'belum-ditugaskan')
    .messages({
      'string.base': 'Filter must be a string.',
      'any.only': 'Filter must be either "semua", "sudah-diperiksa" or "belum-diperiksa".',
    }),
    filterDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}\.\.\.\d{4}-\d{2}-\d{2}$/)
      .messages({
        'string.pattern.base': 'Filter date must be in the format (YYYY-MM-DD...YYYY-MM-DD).',
        'any.required': 'Filter date is required.'
      }), 
    status: Joi.number()
      .integer()
      .messages({
        'number.base': 'Status must be a number.',
        'number.integer': 'Status must be an integer.'
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
  getWorkOrderByCompany: Joi.object({
    day: Joi.date()
      .iso()
      .messages({
        'date.base': 'Filter day must be a valid date.',
        'date.format': 'Filter day must be in (YYYY-MM-DD) format.' 
      }),
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
  }),
  assignWorkOrder: Joi.object({
    id: Joi.string()
    .pattern(/^WO-\d+$/)
    .required()
    .messages({
      'string.empty': 'ID wajib diisi.',
      'string.pattern.base': 'ID harus dengan format WO-<number>.',
      'any.required' : 'ID wajib diisi.'
    }),
    pic: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'PIC wajib diisi.',
      'number.min': 'Value yang dipilih tidak boleh negatif.',
      'any.required': 'PIC wajib diisi.'
    }),
    notes: Joi.string()
      .allow('')
      .max(1000)
      .messages({
        'string.max': 'Komentar/Catatan tidak boleh melebihi 1000 karakter.'
      })
  }),
  doneWorkOrder: Joi.object({
    id: Joi.string()
      .pattern(/^WO-\d+$/)
      .required()
      .messages({
        'string.empty': 'ID is required.',
        'string.pattern.base': 'ID must be in the format WO-<number>.',
        'any.required' : 'ID is required.'
      }),
    done: Joi.string()
      .valid(true, false)
      .required()
      .messages({
        'string.base': 'Done value must be a boolean.',
        'any.only': 'Done value must be either "True" or "False".',
        'any.required': 'Done value is required.'
      }),
}),
}

export { workOrderSchema };