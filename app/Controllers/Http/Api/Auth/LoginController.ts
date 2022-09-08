import { schema, rules, validator } from '@ioc:Adonis/Core/Validator';

export default class LoginController {
    public async store({ auth, request }) {
        const userSchema = schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.maxLength(255),
            ]),
            password: schema.string({}, [
                rules.maxLength(255),
            ]),
        });

        try {
            await request.validate({
                schema: userSchema,
                reporter: validator.reporters.api,
                messages: {
                    required: 'The {{ field }} is required.',
                }
            });
        } catch (error) {
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
        } catch (error) {
            return {
                type: 'error',
                message: 'Invalid credentials.',
                errors: error,
            };
        }
    }
}
