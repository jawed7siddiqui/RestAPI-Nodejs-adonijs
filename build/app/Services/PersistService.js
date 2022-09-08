"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const ProductAttribute_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductAttribute"));
const ProductCategoryAttribute_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductCategoryAttribute"));
const ProductFAQ_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductFAQ"));
const ProductMedia_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductMedia"));
const Setting_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Setting"));
class PersistService {
    user(user) {
        return {
            id: user?.id ?? '',
            role_id: user?.role_id ?? '',
            name: user?.name ?? '',
            phone: user?.phone ?? '',
            email: user?.email ?? '',
            username: user?.username ?? '',
            status: user?.status ?? '',
            created_at: user?.createdAt?.toString(),
            updated_at: user?.updatedAt?.toString(),
        };
    }
    async productCategory(productCategory) {
        let productCategoryAttributes = await this.productCategoryAttributes(productCategory.id);
        return {
            id: productCategory?.id ?? '',
            parent_id: productCategory?.parent_id ?? '',
            name: productCategory?.name ?? '',
            slug: productCategory?.slug ?? '',
            image: productCategory?.image ?? '',
            attributes: productCategoryAttributes,
            status: productCategory?.status ?? '',
            created_at: productCategory?.createdAt?.toString(),
            updated_at: productCategory?.updatedAt?.toString(),
        };
    }
    async productCategoryAttributes(product_category_id) {
        const productCategoryAttributes = await ProductCategoryAttribute_1.default.query().where('category_id', product_category_id);
        return productCategoryAttributes.map((productCategoryAttribute) => {
            return this.productCategoryAttribute(productCategoryAttribute);
        });
    }
    productCategoryAttribute(productCategoryAttribute) {
        return {
            id: productCategoryAttribute?.id ?? '',
            category_id: productCategoryAttribute?.category_id ?? '',
            name: productCategoryAttribute?.name ?? '',
            status: productCategoryAttribute?.status ?? '',
            created_at: productCategoryAttribute?.createdAt?.toString(),
            updated_at: productCategoryAttribute?.updatedAt?.toString(),
        };
    }
    async product(product) {
        let medias = await ProductMedia_1.default.query().where('product_id', product.id).then((medias) => {
            return medias.map((media) => {
                return { id: media.id, src: `${Env_1.default.get('APP_URL')}/uploads/${media.src}` };
            });
        });
        let productAttributes = await this.productAttribute(product.id);
        let productFAQs = await this.productFAQs(product.id);
        return {
            id: product?.id ?? '',
            category_id: product?.category_id ?? '',
            title: product?.title ?? '',
            short_description: product?.short_description ?? '',
            long_description: product?.long_description ?? '',
            html_content: product?.html_content ?? '',
            price: product?.price ?? 0,
            discount: product?.discount ?? 0,
            country_of_origin: product?.country_of_origin ?? '',
            medias: medias,
            attributes: productAttributes,
            faqs: productFAQs,
            stock: product?.stock ?? 0,
            status: product?.status ?? '',
            created_at: product?.createdAt?.toString(),
            updated_at: product?.updatedAt?.toString(),
        };
    }
    async productAttribute(product_id) {
        const productAttributes = await ProductAttribute_1.default.query().preload('attribute').where('product_id', product_id);
        return productAttributes
            .filter((productAttribute) => productAttribute?.attribute)
            .map((productAttribute) => {
            return {
                id: productAttribute?.id ?? '',
                product_id: productAttribute?.product_id ?? '',
                attribute_id: productAttribute?.attribute_id ?? '',
                name: productAttribute?.attribute?.name ?? '',
                value: productAttribute?.value ?? '',
                created_at: productAttribute?.createdAt?.toString(),
                updated_at: productAttribute?.updatedAt?.toString(),
            };
        });
    }
    async productFAQs(product_id) {
        const productFAQs = await ProductFAQ_1.default.query().where('product_id', product_id);
        return productFAQs.map((productFAQ) => {
            return this.productFAQ(productFAQ);
        });
    }
    async productFAQ(productFAQ) {
        return {
            id: productFAQ?.id ?? '',
            product_id: productFAQ?.product_id ?? '',
            question: productFAQ?.question ?? '',
            answer: productFAQ?.answer ?? '',
            created_at: productFAQ?.createdAt?.toString(),
            updated_at: productFAQ?.updatedAt?.toString(),
        };
    }
    async setting(setting) {
        if (!setting) {
            const settings = await Setting_1.default.all();
            let items = settings.map((setting) => {
                let key = setting.key;
                let value = key == 'site_logo'
                    ? `${Env_1.default.get('APP_URL')}/uploads/${setting.value}`
                    : setting.value;
                return { [key]: value };
            });
            return Object.assign({}, ...items);
        }
        return setting.key == 'site_logo'
            ? `${Env_1.default.get('APP_URL')}/uploads/${setting.value}`
            : (setting?.value ?? '');
    }
}
exports.default = PersistService;
//# sourceMappingURL=PersistService.js.map