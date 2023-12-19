import ApiError from '../exceptions/api-error.js';

const errorMiddleware = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
};

export default errorMiddleware;
