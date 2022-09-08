import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.bigInteger('role_id').nullable()
      table.string('name', 255).nullable()
      table.string('phone', 255).nullable()
      table.string('email', 255).nullable()
      table.string('username', 255).nullable()
      table.string('password', 255).nullable()
      table.timestamp('email_verified_at', { useTz: true }).nullable()
      table.timestamp('phone_verified_at', { useTz: true }).nullable()
      table.enum('status', ['Active', 'Inactive']).nullable()
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
