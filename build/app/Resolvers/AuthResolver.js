"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const GQLService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/GQLService"));
const PersistService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PersistService"));
const resolvers = {
    Mutation: {
        async login(_, { email, password }, { ctx }) {
            try {
                await ctx.request.validate({
                    data: {
                        email: email,
                        password: password,
                    },
                    schema: Validator_1.schema.create({
                        email: Validator_1.schema.string({}, [
                            Validator_1.rules.email(),
                            Validator_1.rules.maxLength(255),
                        ]),
                        password: Validator_1.schema.string({}, [
                            Validator_1.rules.maxLength(255),
                        ]),
                    }),
                    reporter: Validator_1.validator.reporters.api,
                    messages: {
                        required: 'The {{ field }} is required.',
                    },
                });
            }
            catch (error) {
                return (new GQLService_1.default()).validationError(error);
            }
            const user = await User_1.default
                .query()
                .where('email', email)
                .first();
            if (!user) {
                return (new GQLService_1.default()).error(404);
            }
            if (user) {
                await Database_1.default
                    .query()
                    .from('api_tokens')
                    .where('user_id', user.id)
                    .delete();
            }
            const { token } = await ctx.auth.use('api').attempt(email, password);
            return {
                token: token,
                user: (new PersistService_1.default()).user(ctx.auth.use('api').user),
            };
        },
    },
};
module.exports = resolvers;
//# sourceMappingURL=AuthResolver.js.map