import {schema, rules, validator} from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import GQLService from "App/Services/GQLService";
import PersistService from "App/Services/PersistService";

const resolvers = {
    Mutation: {
        async login(_, {email, password}, {ctx}) {
            try {
                await ctx.request.validate({
                    data: {
                        email: email,
                        password: password,
                    },
                    schema: schema.create({
                        email: schema.string({}, [
                            rules.email(),
                            rules.maxLength(255),
                        ]),
                        password: schema.string({}, [
                            rules.maxLength(255),
                        ]),
                    }),
                    reporter: validator.reporters.api,
                    messages: {
                        required: 'The {{ field }} is required.',
                    },
                });
            } catch (error) {
                return (new GQLService()).validationError(error);
            }

            const user = await User
                .query()
                .where('email', email)
                .first();

            if (! user) {
                return (new GQLService()).error(404);
            }

            if (user) {
                await Database
                    .query()
                    .from('api_tokens')
                    .where('user_id', user.id)
                    .delete();
            }

            const {token} = await ctx.auth.use('api').attempt(email, password);

            return {
                token: token,
                user: (new PersistService()).user(ctx.auth.use('api').user),
            };
        },
    },
}

module.exports = resolvers;
