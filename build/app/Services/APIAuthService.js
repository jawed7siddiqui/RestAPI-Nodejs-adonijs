"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIAuthService {
    async authenticate(ctx, guard = 'api') {
        let hasAuth = await ctx.auth.use(guard).check();
        if (!hasAuth) {
            throw Error('Unauthorized access.');
        }
    }
}
exports.default = APIAuthService;
//# sourceMappingURL=APIAuthService.js.map