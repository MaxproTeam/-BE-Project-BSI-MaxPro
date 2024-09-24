import Joi from 'joi';

const loginUserSchema = Joi.object({
  username: Joi.string()
      .required()
      .messages({
          'string.empty': 'Nama pengguna wajib diisi.',
          'any.required': 'Nama pengguna wajib diisi.'
      }),
  
  password: Joi.string()
      .required()
      .messages({
            'string.empty': 'Password wajib diisi.',
            'any.required': 'Password wajib diisi.'
      })
});

const registrationSchema = Joi.object({
    fullname: Joi.string()
        .required()
        .messages({
            'string.base': 'Nama pengguna harus berupa string.',
            'string.empty': 'Nama pengguna wajib diisi.',
            'any.required': 'Nama pengguna wajib diisi.'
        }),
    
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .messages({
            'string.base': 'Email harus berupa string.',
            'string.email': 'Masukkan alamat email yang valid.'
        }),
    
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,30}$'))
        .required()
        .messages({
            'string.base': 'Password harus berupa string.',
            'string.empty': 'Password wajib diisi.',
            'string.pattern.base': 'Password minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial.',
            'any.required': 'Password wajib diisi.'
        })
});

export {loginUserSchema, registrationSchema};