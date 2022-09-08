"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const APIAuthService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/APIAuthService"));
const GQLService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/GQLService"));
const PersistService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PersistService"));
const resolvers = {
    Query: {
        async userFindAll(_, {}, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            const users = await User_1.default.all();
            return users.map((user) => (new PersistService_1.default()).user(user));
        },
        async userFindOne(_, { id }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            const user = await User_1.default.find(id);
            if (!user) {
                return (new GQLService_1.default()).error(404);
            }
            return (new PersistService_1.default()).user(user);
        },
    },
    Mutation: {
        async userCreate(_, { data }, { ctx }) {
            try {
                await ctx.request.validate({
                    data: data,
                    schema: Validator_1.schema.create({
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
                    }),
                    reporter: Validator_1.validator.reporters.api,
                    messages: {
                        required: 'The {{ field }} is required.',
                        unique: 'The {{ field }} has already been taken.',
                    }
                });
            }
            catch (error) {
                return (new GQLService_1.default()).validationError(error);
            }
            const user = await User_1.default.create({ ...data, ...{ role_id: 3, status: 'Active' } });
            return (new PersistService_1.default()).user(user);
        },
    },
};
module.exports = resolvers;
//# sourceMappingURL=UserResolver.js.map