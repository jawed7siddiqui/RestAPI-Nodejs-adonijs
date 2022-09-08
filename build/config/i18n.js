"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const i18nConfig = {
    translationsFormat: 'icu',
    defaultLocale: 'en',
    provideValidatorMessages: true,
    loaders: {
        fs: {
            enabled: true,
            location: Application_1.default.resourcesPath('lang'),
        },
    },
};
exports.default = i18nConfig;
//# sourceMappingURL=i18n.js.map