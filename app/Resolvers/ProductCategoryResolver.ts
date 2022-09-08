import {schema, rules, validator} from "@ioc:Adonis/Core/Validator";
import ProductCategory from "App/Models/ProductCategory";
import ProductCategoryAttribute from "App/Models/ProductCategoryAttribute";
import APIAuthService from "App/Services/APIAuthService";
import GQLService from "App/Services/GQLService";
import PersistService from "App/Services/PersistService";

const validateProductCategoryData = async function(data: any, id?: null) {
    let ignoreRules = id ? {whereNot: {id: id}} : {};

    try {
        await validator.validate({
            data: data,
            schema: schema.create({
                name: schema.string({}, [
                    rules.maxLength(255),
                    rules.unique({table: 'product_categories', column: 'name', ...ignoreRules}),
                ]),
                slug: schema.string({}, [
                    rules.maxLength(255),
                    rules.unique({table: 'product_categories', column: 'slug', ...ignoreRules}),
                ]),
                status: schema.string({}, [
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
};

const validateProductCategoryAttributeData = async function(data: any, category_id?: null, id?: null | undefined) {
    let ignoreRules = id ? {whereNot: {id: id}} : {};

    try {
        await validator.validate({
            data: data,
            schema: schema.create({
                name: schema.string({}, [
                    rules.maxLength(255),
                    rules.unique({table: 'product_category_attributes', column: 'name', ...{where: {category_id: category_id}}, ...ignoreRules}),
                ]),
                status: schema.string({}, [
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
};

const resolvers = {
    Query: {
        async productCategoryFindAll(_, {}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const productCategories = await ProductCategory.all();

            return productCategories.map((productCategory) => (new PersistService()).productCategory(productCategory));
        },

        async productCategoryFindOne(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const productCategory = await ProductCategory.find(id);

            if (! productCategory) {
                return (new GQLService()).error(404);
            }

            return (new PersistService()).productCategory(productCategory);
        },
    },

    Mutation: {
        async productCategoryCreate(_, {data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            await validateProductCategoryData(data);

            const productCategory = await ProductCategory.create(data);

            return (new PersistService()).productCategory(productCategory);
        },

        async productCategoryUpdate(_, {id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productCategory = await ProductCategory.find(id);

            if (! productCategory) {
                return (new GQLService()).error(404);
            }

            await validateProductCategoryData(data, id);

            await productCategory.merge(data).save();

            productCategory = await ProductCategory.find(id);

            return (new PersistService()).productCategory(productCategory);
        },

        async productCategoryDelete(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productCategory = await ProductCategory.find(id);

            if (! productCategory) {
                return (new GQLService()).error(404);
            }

            await productCategory.delete();

            return true;
        },

        async productCategoryAttributeCreate(_, {category_id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productCategory = await ProductCategory.find(category_id);

            if (! productCategory) {
                return (new GQLService()).error(404);
            }

            await validateProductCategoryAttributeData(data, category_id);

            const productCategoryAttribute = await ProductCategoryAttribute.create({...data, ...{category_id: category_id}});

            return (new PersistService()).productCategoryAttribute(productCategoryAttribute);
        },

        async productCategoryAttributeUpdate(_, {id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productCategoryAttribute = await ProductCategoryAttribute.find(id);

            if (! productCategoryAttribute) {
                return (new GQLService()).error(404);
            }

            await validateProductCategoryAttributeData(data, productCategoryAttribute?.category_id, id);

            await productCategoryAttribute.merge(data).save();

            productCategoryAttribute = await ProductCategoryAttribute.find(id);

            return (new PersistService()).productCategoryAttribute(productCategoryAttribute);
        },

        async productCategoryAttributeDelete(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productCategoryAttribute = await ProductCategoryAttribute.find(id);

            if (! productCategoryAttribute) {
                return (new GQLService()).error(404);
            }

            await productCategoryAttribute.delete();

            return true;
        },
    },
}

module.exports = resolvers;
