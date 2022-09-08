import User from "App/Models/User";
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator';

export default class RegisterController {
    public async store({request}) {
        const userSchema = schema.create({
            name: schema.string.optional({}, [
                rules.maxLength(255),
            ]),
            phone: schema.string.optional({}, [
                rules.maxLength(255),
            ]),
            email: schema.string({}, [
                rules.email(),
                rules.maxLength(255),
                rules.unique({ table: 'users', column: 'email' }),
            ]),
            username: schema.string.optional({}, [
                rules.maxLength(255),
            ]),
            password: schema.string({}, [
                rules.maxLength(255),
            ]),
        });

        let payload;

        try {
            payload = await request.validate({
                schema: userSchema,
                reporter: validator.reporters.api,
                messages: {
                    required: 'The {{ field }} is required.',
                    unique: 'The {{ field }} has already been taken.',
                }
            });
        } catch (error) {
            return {
                type: 'error',
                message: 'Invalid validation.',
                errors: error.messages.errors,
            };
        }

        const user = await User.create({...payload, ...{role_id: 3, status: 'Active'}});

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
