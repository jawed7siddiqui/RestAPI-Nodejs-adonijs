import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class ProductFAQ extends BaseModel {
  public static table = 'product_faqs'

  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: any

  @column()
  public question: any

  @column()
  public answer: any

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
