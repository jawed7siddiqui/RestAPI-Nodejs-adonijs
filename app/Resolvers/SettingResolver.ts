import {schema, rules, validator} from "@ioc:Adonis/Core/Validator";
import Setting from "App/Models/Setting";
import APIAuthService from "App/Services/APIAuthService";
import GQLService from "App/Services/GQLService";
import PersistService from "App/Services/PersistService";

const resolvers = {
    Query: {
        async settingFindAll(_, {}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            return (new PersistService()).setting();
        },

        async settingFindOne(_, {key}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const setting = await Setting.query().where('key', key).first();

            if (! setting) {
                return (new GQLService()).error(404);
            }

            return (new PersistService()).setting(setting);
        },
    },

    Mutation: {
        async settingUpdateOrCreate(_, {data}, {ctx}) {
            try {
                await ctx.request.validate({
                    data: data,
                    schema: schema.create({
                        site_name: schema.string({}, [
                            rules.maxLength(255),
                        ]),
                        site_category: schema.string({}, [
                            rules.maxLength(255),
                        ]),
                        site_type: schema.string({}, [
                            rules.maxLength(255),
                        ]),
                        // site_logo: schema.file.optional({
                        //     size: '2mb',
                        //     extnames: ['jpg', 'gif', 'png', 'svg'],
                        // }),
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

            // Object.entries(data).forEach(async ([key, value]) => {
            //     await Setting.updateOrCreate({ 'key': key }, {
            //         value: value,
            //     });
            // });

            await Setting.updateOrCreate({key: 'site_name' }, {value: data.site_name});

            await Setting.updateOrCreate({key: 'site_category' }, {value: data.site_category});

            await Setting.updateOrCreate({key: 'site_type' }, {value: data.site_type});

            if (data.site_logo) {
                const site_logo = await (new GQLService()).upload(data.site_logo);

                await Setting.updateOrCreate({key: 'site_logo' }, {value: site_logo});
            }

            return await (new PersistService()).setting();
        },
    },
}

module.exports = resolvers;
