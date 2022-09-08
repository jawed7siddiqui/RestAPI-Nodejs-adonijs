import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class ProductMedia extends BaseModel {
  public static table = 'product_medias'

  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: any

  @column()
  public src: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
