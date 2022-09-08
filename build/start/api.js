"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.group(() => {
        Route_1.default.post('login', 'Api/Auth/LoginController.store').as('login');
        Route_1.default.post('register', 'Api/Auth/RegisterController.store').as('register');
    }).prefix('/v1');
})
    .prefix('/api')
    .as('api');
//# sourceMappingURL=api.js.map