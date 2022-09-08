"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class UsersSchema extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.bigInteger('role_id').nullable();
            table.string('name', 255).nullable();
            table.string('phone', 255).nullable();
            table.string('email', 255).nullable();
            table.string('username', 255).nullable();
            table.string('password', 255).nullable();
            table.timestamp('email_verified_at', { useTz: true }).nullable();
            table.timestamp('phone_verified_at', { useTz: true }).nullable();
            table.enum('status', ['Active', 'Inactive']).nullable();
            table.string('remember_me_token').nullable();
            table.timestamp('created_at', { useTz: true }).notNullable();
            table.timestamp('updated_at', { useTz: true }).notNullable();
            table.timestamp('deleted_at', { useTz: true }).nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = UsersSchema;
//# sourceMappingURL=1660532622208_users.js.map