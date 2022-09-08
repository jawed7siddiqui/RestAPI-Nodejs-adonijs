export default class APIAuthService {
    public async authenticate(ctx: any, guard = 'api') {
        let hasAuth = await ctx.auth.use(guard).check();

        if (! hasAuth) {
            throw Error('Unauthorized access.');
        }
    }
}
