import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  public static table = 'products'

  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: any

  @column()
  public title: string

  @column()
  public short_description: string

  @column()
  public long_description: string

  @column()
  public html_content: string

  @column()
  public price: any

  @column()
  public discount: any

  @column()
  public discount_type: string

  @column()
  public discount_expires_at: DateTime

  @column()
  public country_of_origin: string

  @column()
  public stock: any

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
