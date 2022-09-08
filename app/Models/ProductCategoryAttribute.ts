import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class ProductCategoryAttribute extends BaseModel {
  public static table = 'product_category_attributes'

  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: any

  @column()
  public name: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
