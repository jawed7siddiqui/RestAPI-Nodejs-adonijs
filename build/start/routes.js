"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(global[Symbol.for('ioc.use')]("Zakodium/Apollo/Server"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
require("./api");
Route_1.default.get('/', async ({ view }) => {
    return view.render('welcome');
});
Server_1.default.applyMiddleware();
//# sourceMappingURL=routes.js.map