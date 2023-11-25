import { ApiError } from './api-error';

export const errorMiddleware = function (err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.errors.message,
      errors: err.errors,
    });
  }
  return res.status(500).json({ message: 'Ошибка не относится к ApiErrors' });
};
