"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'products';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.bigInteger('category_id').nullable();
            table.string('title', 255).nullable();
            table.text('short_description', 'longtext').nullable();
            table.text('long_description', 'longtext').nullable();
            table.text('html_content', 'longtext').nullable();
            table.float('price').defaultTo(0);
            table.string('discount_type').nullable();
            table.float('discount').defaultTo(0);
            table.timestamp('discount_expires_at').nullable();
            table.string('country_of_origin', 255).nullable();
            table.bigInteger('stock').defaultTo(0);
            table.enum('status', ['Active', 'Inactive']).nullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
            table.timestamp('deleted_at', { useTz: true }).nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1661386362875_products.js.map