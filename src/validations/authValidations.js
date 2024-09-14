import Joi from 'joi';

const loginUserSchema = Joi.object({
  username: Joi.string()
      .required()
      .messages({
          'string.empty': 'Kolom username harus diisi.'
      }),
  
  password: Joi.string()
      .min(8)
      .pattern(new RegExp(/[a-z]/))
      .pattern(new RegExp(/[A-Z]/))
      .pattern(new RegExp(/\d/))
      .pattern(new RegExp(/[\W_]/))
      .required()
      .messages({
          'string.empty': 'Kolom kata sandi harus diisi.',
          'string.min': 'Kata sandi harus terdiri dari minimal 8 karakter.',
          'string.pattern.base': {
              '/[a-z]/': 'Kata sandi harus mengandung setidaknya satu huruf kecil.',
              '/[A-Z]/': 'Kata sandi harus mengandung setidaknya satu huruf besar.',
              '/\d/': 'Kata sandi harus mengandung setidaknya satu nomor.',
              '/[\W_]/': 'Kata sandi harus mengandung setidaknya satu karakter khusus (@, #, $, etc.).'
          }
      })
      .custom((value, helpers) => {
          if (commonPasswords.includes(value)) {
              return helpers.message('Kata sandi terlalu umum, harap pilih kata sandi yang lebih aman.');
          }

          return value;
      })
});

// const registerUserSchema = Joi.object({
    
// });

export {loginUserSchema};