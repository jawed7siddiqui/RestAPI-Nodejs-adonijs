import Env from '@ioc:Adonis/Core/Env';
import ProductAttribute from 'App/Models/ProductAttribute';
import ProductCategoryAttribute from 'App/Models/ProductCategoryAttribute';
import ProductFAQ from 'App/Models/ProductFAQ';
import ProductMedia from 'App/Models/ProductMedia';
import Setting from "App/Models/Setting";

export default class PersistService {
    public user(user: any) {
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

    public async productCategory(productCategory: any) {
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

    public async productCategoryAttributes(product_category_id: any) {
        const productCategoryAttributes = await ProductCategoryAttribute.query().where('category_id', product_category_id);

        return productCategoryAttributes.map((productCategoryAttribute) => {
            return this.productCategoryAttribute(productCategoryAttribute);
        });
    }

    public productCategoryAttribute(productCategoryAttribute: any) {
        return {
            id: productCategoryAttribute?.id ?? '',
            category_id: productCategoryAttribute?.category_id ?? '',
            name: productCategoryAttribute?.name ?? '',
            status: productCategoryAttribute?.status ?? '',
            created_at: productCategoryAttribute?.createdAt?.toString(),
            updated_at: productCategoryAttribute?.updatedAt?.toString(),
        };
    }

    public async product(product: any) {
        let medias = await ProductMedia.query().where('product_id', product.id).then((medias) => {
            return medias.map((media) => {
                return {id: media.id, src: `${Env.get('APP_URL')}/uploads/${media.src}`};
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

    public async productAttribute(product_id: any) {
        const productAttributes = await ProductAttribute.query().preload('attribute').where('product_id', product_id);

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

    public async productFAQs(product_id: any) {
        const productFAQs = await ProductFAQ.query().where('product_id', product_id);

        return productFAQs.map((productFAQ) => {
            return this.productFAQ(productFAQ);
        });
    }

    public async productFAQ(productFAQ: any) {
        return {
            id: productFAQ?.id ?? '',
            product_id: productFAQ?.product_id ?? '',
            question: productFAQ?.question ?? '',
            answer: productFAQ?.answer ?? '',
            created_at: productFAQ?.createdAt?.toString(),
            updated_at: productFAQ?.updatedAt?.toString(),
        };
    }

    public async setting(setting?: any | null) {
        if (! setting) {
            const settings = await Setting.all();

            let items = settings.map((setting) => {
                let key = setting.key;

                let value = key == 'site_logo'
                    ? `${Env.get('APP_URL')}/uploads/${setting.value}`
                    : setting.value;

                return {[key]: value};
            });

            return Object.assign({}, ...items);
        }

        return setting.key == 'site_logo'
            ? `${Env.get('APP_URL')}/uploads/${setting.value}`
            : (setting?.value ?? '');
    }
}
