import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.group(() => {
        Route.post('login', 'Api/Auth/LoginController.store').as('login');
        Route.post('register', 'Api/Auth/RegisterController.store').as('register');
    }).prefix('/v1');
})
.prefix('/api')
.as('api');
