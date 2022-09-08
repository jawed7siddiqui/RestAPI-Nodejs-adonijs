import {schema, rules, validator} from "@ioc:Adonis/Core/Validator";
import Product from "App/Models/Product";
import ProductAttribute from "App/Models/ProductAttribute";
import ProductCategoryAttribute from "App/Models/ProductCategoryAttribute";
import ProductFAQ from "App/Models/ProductFAQ";
import ProductMedia from "App/Models/ProductMedia";
import APIAuthService from "App/Services/APIAuthService";
import GQLService from "App/Services/GQLService";
import PersistService from "App/Services/PersistService";

const validateProductData = async function(data: any, id?: null) {
    let ignoreRules = id ? {whereNot: {id: id}} : {};

    console.log(ignoreRules);

    try {
        await validator.validate({
            data: data,
            schema: schema.create({
                title: schema.string({}, [
                    rules.maxLength(255),
                    // rules.unique({table: 'products', column: 'title', ...ignoreRules}),
                ]),
                category_id: schema.number(),
                price: schema.number(),
                discount: schema.number.optional(),
                country_of_origin: schema.string.optional({}, [
                    rules.maxLength(255),
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
        async productFindAll(_, {}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const productCategories = await Product.all();

            return productCategories.map((product) => (new PersistService()).product(product));
        },

        async productFindOne(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            const product = await Product.find(id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            return (new PersistService()).product(product);
        },
    },

    Mutation: {
        async productCreate(_, {data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            await validateProductData(data);

            const medias = data.medias;

            if (medias) {
                delete data.medias;
            }

            const product = await Product.create({...data, ...{discount_type: 'Percentage'}});

            if (medias) {
                const mediaUpload = async () => {
                    return Promise.all(
                        medias.map(async (file) => {
                            let fileName = await (new GQLService()).upload(file);

                            await ProductMedia.create({product_id: product.id, src: fileName});

                            return fileName;
                        })
                    );
                }

                return mediaUpload().then(() => {
                    return (new PersistService()).product(product);
                });
            }

            return (new PersistService()).product(product);
        },

        async productUpdate(_, {id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let product = await Product.find(id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            await validateProductData(data, id);

            const medias = data.medias;

            if (medias) {
                delete data.medias;
            }

            await product.merge(data).save();

            product = await Product.find(id);

            if (medias) {
                const mediaUpload = async () => {
                    return Promise.all(
                        medias.map(async (file) => {
                            let fileName = await (new GQLService()).upload(file);

                            await ProductMedia.create({product_id: id, src: fileName});

                            return fileName;
                        })
                    );
                }

                return mediaUpload().then(() => {
                    return (new PersistService()).product(product);
                });
            }

            return (new PersistService()).product(product);
        },

        async productDelete(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let product = await Product.find(id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            await product.delete();

            return true;
        },

        async productMediaDelete(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productMedia = await ProductMedia.find(id);

            if (! productMedia) {
                return (new GQLService()).error(404);
            }

            await productMedia.delete();

            return true;
        },

        async productAttributeUpdateOrCreate(_, {product_id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let product = await Product.find(product_id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            let attribute = await ProductCategoryAttribute.query()
                .where({'category_id': product.category_id, 'name': data.name})
                .first();

            if (! attribute) {
                return (new GQLService()).error(404, `The ${data.name} attribute not available.`);
            }

            await ProductAttribute.updateOrCreate({
                product_id: product.id,
                attribute_id: attribute.id,
            }, {value: data.value});

            return (new PersistService()).productAttribute(product_id);
        },

        async productAttributeDelete(_, {product_id, name}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let product = await Product.find(product_id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            let attribute = await ProductCategoryAttribute.query()
                .where({'category_id': product.category_id, 'name': name})
                .first();

            if (! attribute) {
                return (new GQLService()).error(404, `The ${name} attribute not available.`);
            }

            let productAttribute = await ProductAttribute.query()
                .where({'product_id': product.id, 'attribute_id': attribute.id})
                .first();

            if (! productAttribute) {
                return (new GQLService()).error(404, `The ${name} attribute not found.`);
            }

            await productAttribute.delete();

            return true;
        },

        async productFAQCreate(_, {product_id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let product = await Product.find(product_id);

            if (! product) {
                return (new GQLService()).error(404);
            }

            const productFAQ = await ProductFAQ.create({...data, ...{product_id: product.id, status: 'Active'}});

            return (new PersistService()).productFAQ(productFAQ);
        },

        async productFAQUpdate(_, {id, data}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productFAQ = await ProductFAQ.find(id);

            if (! productFAQ) {
                return (new GQLService()).error(404);
            }

            await productFAQ.merge(data).save();

            productFAQ = await ProductFAQ.find(id);

            return (new PersistService()).productFAQ(productFAQ);
        },

        async productFAQDelete(_, {id}, {ctx}) {
            await (new APIAuthService()).authenticate(ctx);

            let productFAQ = await ProductFAQ.find(id);

            if (! productFAQ) {
                return (new GQLService()).error(404);
            }

            await productFAQ.delete();

            return true;
        },
    },
}

module.exports = resolvers;
