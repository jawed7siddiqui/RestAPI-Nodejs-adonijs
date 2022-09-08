"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apolloConfig = {
    schemas: 'app/Schemas',
    resolvers: 'app/Resolvers',
    path: '/graphql',
    apolloServer: {
        context({ ctx }) {
            return { ctx };
        },
    },
    executableSchema: {
        inheritResolversFromInterfaces: true,
    },
    enablePlayground: true,
};
exports.default = apolloConfig;
//# sourceMappingURL=apollo.js.map