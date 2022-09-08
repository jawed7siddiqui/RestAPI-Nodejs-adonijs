import {schema, rules, validator} from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import APIAuthService from "App/Services/APIAuthService";
import GQLService from "App/Services/GQLService";
import PersistService from "App/Services/PersistService";

const resolvers = {
    Query: {
        async userFindAll(_, {}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const users = await User.all();

            return users.map((user) => (new PersistService()).user(user));
        },

        async userFindOne(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const user = await User.find(id);

            if (! user) {
                return (new GQLService()).error(404);
            }

            return (new PersistService()).user(user);
        },
    },

    Mutation: {
        async userCreate(_, {data}, {ctx}) {
            try {
                await ctx.request.validate({
                    data: data,
                    schema: schema.create({
                        name: schema.string.optional({}, [
                            rules.maxLength(255),
                        ]),
                        phone: schema.string.optional({}, [
                            rules.maxLength(255),
                        ]),
                        email: schema.string({}, [
                            rules.email(),
                            rules.maxLength(255),
                            rules.unique({table: 'users', column: 'email'}),
                        ]),
                        username: schema.string.optional({}, [
                            rules.maxLength(255),
                        ]),
                        password: schema.string({}, [
                            rules.maxLength(255),
                        ]),
                    }),
                    reporter: validator.reporters.api,
                    messages: {
                        required: 'The {{ field }} is required.',
                        unique: 'The {{ field }} has already been taken.',
                    }
                });
            } catch (error) {
                return (new GQLService()).validationError(error);
            }

            const user = await User.create({...data, ...{role_id: 3, status: 'Active'}});

            return (new PersistService()).user(user);
        },
    },
}

module.exports = resolvers;
