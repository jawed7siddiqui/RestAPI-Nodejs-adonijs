"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class RegisterController {
    async store({ request }) {
        const userSchema = Validator_1.schema.create({
            name: Validator_1.schema.string.optional({}, [
                Validator_1.rules.maxLength(255),
            ]),
            phone: Validator_1.schema.string.optional({}, [
                Validator_1.rules.maxLength(255),
            ]),
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(255),
                Validator_1.rules.unique({ table: 'users', column: 'email' }),
            ]),
            username: Validator_1.schema.string.optional({}, [
                Validator_1.rules.maxLength(255),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.maxLength(255),
            ]),
        });
        let payload;
        try {
            payload = await request.validate({
                schema: userSchema,
                reporter: Validator_1.validator.reporters.api,
                messages: {
                    required: 'The {{ field }} is required.',
                    unique: 'The {{ field }} has already been taken.',
                }
            });
        }
        catch (error) {
            return {
                type: 'error',
                message: 'Invalid validation.',
                errors: error.messages.errors,
            };
        }
        const user = await User_1.default.create({ ...payload, ...{ role_id: 3, status: 'Active' } });
        return {
            type: 'success',
            message: 'Register has been successfully completed.',
            data: {
                id: user?.id,
                role_id: user?.role_id ?? '',
                name: user?.name ?? '',
                phone: user?.phone ?? '',
                email: user?.email ?? '',
                username: user?.username ?? '',
                status: user?.status ?? '',
                created_at: user?.createdAt,
                updated_at: user?.updatedAt,
            },
        };
    }
}
exports.default = RegisterController;
//# sourceMappingURL=RegisterController.js.map