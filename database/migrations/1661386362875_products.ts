import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('category_id').nullable()
      table.string('title', 255).nullable()
      table.text('short_description', 'longtext').nullable()
      table.text('long_description', 'longtext').nullable()
      table.text('html_content', 'longtext').nullable()
      table.float('price').defaultTo(0)
      table.string('discount_type').nullable()
      table.float('discount').defaultTo(0)
      table.timestamp('discount_expires_at').nullable()
      table.string('country_of_origin', 255).nullable()
      table.bigInteger('stock').defaultTo(0)
      table.enum('status', ['Active', 'Inactive']).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
