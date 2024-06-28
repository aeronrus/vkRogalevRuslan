"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndReturnString = void 0;
function checkAndReturnString(value) {
    if (value) {
        return value;
    }
    else {
        throw new Error('Значение отсутствует');
    }
}
exports.checkAndReturnString = checkAndReturnString;
