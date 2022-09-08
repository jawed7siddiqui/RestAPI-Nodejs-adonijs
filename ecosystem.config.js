module.exports = {
  apps: [
    {
      name: 'akash-45-adonis_ecommerce',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}