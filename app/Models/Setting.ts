import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Setting extends BaseModel {
  public static table = 'settings'

  @column({ isPrimary: true })
  public id: number

  @column()
  public group: string

  @column()
  public key: string

  @column()
  public value?: string | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
