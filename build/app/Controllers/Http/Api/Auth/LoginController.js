"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginController {
    async store({ auth, request }) {
        const userSchema = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(255),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.maxLength(255),
            ]),
        });
        try {
            await request.validate({
                schema: userSchema,
                reporter: Validator_1.validator.reporters.api,
                messages: {
                    required: 'The {{ field }} is required.',
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
        const email = request.input('email');
        const password = request.input('password');
        try {
            const token = await auth.use('api').attempt(email, password);
            return {
                type: 'success',
                message: 'Login successfully.',
                data: token,
            };
        }
        catch (error) {
            return {
                type: 'error',
                message: 'Invalid credentials.',
                errors: error,
            };
        }
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map