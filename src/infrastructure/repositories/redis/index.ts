import { ICacheRepository } from '../../../domain/repositories/cache.repository'
import { inject, injectable } from 'inversify'
import { ICacheDb } from '../../database/cacheSource'
import { Types } from '../../../di/types'

@injectable()
export class CacheRepositoryImp implements ICacheRepository {
    constructor(
        @inject(Types.ICacheDb)
        private cacheDb: ICacheDb
    ) { }

    async setValue(key: string, value: string): Promise<boolean> {
        return await this.cacheDb.setValue(key, value)
    }

    async getValue<T>(key: string): Promise<T | null> {
        return await this.cacheDb.getValue(key)
    }

    async deleteValue(key: string): Promise<boolean> {
        return await this.cacheDb.deleteValue(key)
    }
}
