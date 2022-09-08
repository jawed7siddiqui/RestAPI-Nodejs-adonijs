import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class ProductCategory extends BaseModel {
  public static table = 'product_categories'

  @column({ isPrimary: true })
  public id: number

  @column()
  public parent_id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public image: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
