"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Setting_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Setting"));
const APIAuthService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/APIAuthService"));
const GQLService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/GQLService"));
const PersistService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PersistService"));
const resolvers = {
    Query: {
        async settingFindAll(_, {}, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            return (new PersistService_1.default()).setting();
        },
        async settingFindOne(_, { key }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            const setting = await Setting_1.default.query().where('key', key).first();
            if (!setting) {
                return (new GQLService_1.default()).error(404);
            }
            return (new PersistService_1.default()).setting(setting);
        },
    },
    Mutation: {
        async settingUpdateOrCreate(_, { data }, { ctx }) {
            try {
                await ctx.request.validate({
                    data: data,
                    schema: Validator_1.schema.create({
                        site_name: Validator_1.schema.string({}, [
                            Validator_1.rules.maxLength(255),
                        ]),
                        site_category: Validator_1.schema.string({}, [
                            Validator_1.rules.maxLength(255),
                        ]),
                        site_type: Validator_1.schema.string({}, [
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
            await Setting_1.default.updateOrCreate({ key: 'site_name' }, { value: data.site_name });
            await Setting_1.default.updateOrCreate({ key: 'site_category' }, { value: data.site_category });
            await Setting_1.default.updateOrCreate({ key: 'site_type' }, { value: data.site_type });
            if (data.site_logo) {
                const site_logo = await (new GQLService_1.default()).upload(data.site_logo);
                await Setting_1.default.updateOrCreate({ key: 'site_logo' }, { value: site_logo });
            }
            return await (new PersistService_1.default()).setting();
        },
    },
};
module.exports = resolvers;
//# sourceMappingURL=SettingResolver.js.map