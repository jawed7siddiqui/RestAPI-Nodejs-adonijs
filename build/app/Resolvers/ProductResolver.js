"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Product_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Product"));
const ProductAttribute_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductAttribute"));
const ProductCategoryAttribute_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductCategoryAttribute"));
const ProductFAQ_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductFAQ"));
const ProductMedia_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductMedia"));
const APIAuthService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/APIAuthService"));
const GQLService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/GQLService"));
const PersistService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PersistService"));
const validateProductData = async function (data, id) {
    let ignoreRules = id ? { whereNot: { id: id } } : {};
    console.log(ignoreRules);
    try {
        await Validator_1.validator.validate({
            data: data,
            schema: Validator_1.schema.create({
                title: Validator_1.schema.string({}, [
                    Validator_1.rules.maxLength(255),
                ]),
                category_id: Validator_1.schema.number(),
                price: Validator_1.schema.number(),
                discount: Validator_1.schema.number.optional(),
                country_of_origin: Validator_1.schema.string.optional({}, [
                    Validator_1.rules.maxLength(255),
                ]),
                status: Validator_1.schema.string({}, [
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
};
const resolvers = {
    Query: {
        async productFindAll(_, {}, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            const productCategories = await Product_1.default.all();
            return productCategories.map((product) => (new PersistService_1.default()).product(product));
        },
        async productFindOne(_, { id }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            const product = await Product_1.default.find(id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            return (new PersistService_1.default()).product(product);
        },
    },
    Mutation: {
        async productCreate(_, { data }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            await validateProductData(data);
            const medias = data.medias;
            if (medias) {
                delete data.medias;
            }
            const product = await Product_1.default.create({ ...data, ...{ discount_type: 'Percentage' } });
            if (medias) {
                const mediaUpload = async () => {
                    return Promise.all(medias.map(async (file) => {
                        let fileName = await (new GQLService_1.default()).upload(file);
                        await ProductMedia_1.default.create({ product_id: product.id, src: fileName });
                        return fileName;
                    }));
                };
                return mediaUpload().then(() => {
                    return (new PersistService_1.default()).product(product);
                });
            }
            return (new PersistService_1.default()).product(product);
        },
        async productUpdate(_, { id, data }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let product = await Product_1.default.find(id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            await validateProductData(data, id);
            const medias = data.medias;
            if (medias) {
                delete data.medias;
            }
            await product.merge(data).save();
            product = await Product_1.default.find(id);
            if (medias) {
                const mediaUpload = async () => {
                    return Promise.all(medias.map(async (file) => {
                        let fileName = await (new GQLService_1.default()).upload(file);
                        await ProductMedia_1.default.create({ product_id: id, src: fileName });
                        return fileName;
                    }));
                };
                return mediaUpload().then(() => {
                    return (new PersistService_1.default()).product(product);
                });
            }
            return (new PersistService_1.default()).product(product);
        },
        async productDelete(_, { id }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let product = await Product_1.default.find(id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            await product.delete();
            return true;
        },
        async productMediaDelete(_, { id }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let productMedia = await ProductMedia_1.default.find(id);
            if (!productMedia) {
                return (new GQLService_1.default()).error(404);
            }
            await productMedia.delete();
            return true;
        },
        async productAttributeUpdateOrCreate(_, { product_id, data }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let product = await Product_1.default.find(product_id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            let attribute = await ProductCategoryAttribute_1.default.query()
                .where({ 'category_id': product.category_id, 'name': data.name })
                .first();
            if (!attribute) {
                return (new GQLService_1.default()).error(404, `The ${data.name} attribute not available.`);
            }
            await ProductAttribute_1.default.updateOrCreate({
                product_id: product.id,
                attribute_id: attribute.id,
            }, { value: data.value });
            return (new PersistService_1.default()).productAttribute(product_id);
        },
        async productAttributeDelete(_, { product_id, name }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let product = await Product_1.default.find(product_id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            let attribute = await ProductCategoryAttribute_1.default.query()
                .where({ 'category_id': product.category_id, 'name': name })
                .first();
            if (!attribute) {
                return (new GQLService_1.default()).error(404, `The ${name} attribute not available.`);
            }
            let productAttribute = await ProductAttribute_1.default.query()
                .where({ 'product_id': product.id, 'attribute_id': attribute.id })
                .first();
            if (!productAttribute) {
                return (new GQLService_1.default()).error(404, `The ${name} attribute not found.`);
            }
            await productAttribute.delete();
            return true;
        },
        async productFAQCreate(_, { product_id, data }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let product = await Product_1.default.find(product_id);
            if (!product) {
                return (new GQLService_1.default()).error(404);
            }
            const productFAQ = await ProductFAQ_1.default.create({ ...data, ...{ product_id: product.id, status: 'Active' } });
            return (new PersistService_1.default()).productFAQ(productFAQ);
        },
        async productFAQUpdate(_, { id, data }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let productFAQ = await ProductFAQ_1.default.find(id);
            if (!productFAQ) {
                return (new GQLService_1.default()).error(404);
            }
            await productFAQ.merge(data).save();
            productFAQ = await ProductFAQ_1.default.find(id);
            return (new PersistService_1.default()).productFAQ(productFAQ);
        },
        async productFAQDelete(_, { id }, { ctx }) {
            await (new APIAuthService_1.default()).authenticate(ctx);
            let productFAQ = await ProductFAQ_1.default.find(id);
            if (!productFAQ) {
                return (new GQLService_1.default()).error(404);
            }
            await productFAQ.delete();
            return true;
        },
    },
};
module.exports = resolvers;
//# sourceMappingURL=ProductResolver.js.map