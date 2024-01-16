class ApiError extends Error {
  //ApiError - это класс, который представляет
  // собой общий тип ошибок, возникающих при взаимодействии с API.
  //Он расширяет встроенный класс Error и имеет свойства status и errors,
  //которые предназначены для хранения информации о статусе ошибки
  //и дополнительных деталей об ошибке.
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  //UnAuthorizedError, BadRequest и ServerError - это статические методы
  //класса ApiError, которые используются для создания экземпляров ApiError
  //с предопределенными значениями статуса и сообщения об ошибке.

  static UnAuthorizedError() {
    return new ApiError(401, 'User not authorizated');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(401, message, errorss);
  }

  static ServerError(message, errors = []) {
    return new ApiError(500, message, errors);
  }
}
export default ApiError;
