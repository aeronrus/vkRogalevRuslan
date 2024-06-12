"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_error_1 = require("../exceptions/api-error");
var errorMiddleware = function (err, req, res, next) {
    if (err instanceof api_error_1.default) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
exports.default = errorMiddleware;
