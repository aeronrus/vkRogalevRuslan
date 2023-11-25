export const ApiError = class extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    //узнать будет ли конструктор ругаться, если передать не все аргументы(например только сообщение)
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnathorizedError(message, errors = []) {
    return new ApiError(401, errors, 'Authorized Error: ' + message);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static ServerErrors(errors = []) {
    return new ApiError(500, errors, 'Server errors');
  }
};
