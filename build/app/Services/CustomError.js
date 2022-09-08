"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    getErrorMessage() {
        return 'Something went wrong: ' + this.message;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map