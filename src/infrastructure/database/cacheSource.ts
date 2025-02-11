import { injectable } from 'inversify'
import { createClient, RedisClientType } from 'redis'
import config from '../../config'

export interface ICacheDb {
	connectDb(): Promise<Boolean>

	setValue(
		key: string,
		value: string,
		ttl?: number
	): Promise<boolean>

	getValue<T>(key: string): Promise<T | null>

	getTtl(key: string): Promise<number | null>

	deleteValue(key: string): Promise<boolean>
}

@injectable()
export class CacheSource implements ICacheDb {
	private client: RedisClientType | null = null

	async connectDb(): Promise<Boolean> {
		try {
			this.client = createClient({
				url: config.CACHE_URL
			})

			console.log('Cache connected')

			return true
		} catch (err) {
			console.error(err)
			return false
		}
	}

	async setValue(key: string, value: string, expireIn?: number): Promise<boolean> {
		if (!this.client) {
			console.error('Cache connection not established')
			return false
		}
		let response
		if (expireIn) {
			response = await this.client.set(key, value, { EX: expireIn });
		} else {
			response = await this.client.set(key, value);
		}
		return Boolean(response)
	}

	async getValue<T>(key: string): Promise<T | null> {
		if (!this.client) {
			console.error('Cache connection not established')
			return null
		}
		const response = await this.client.get(key)
		return response ? JSON.parse(response) : null
	}

	async getTtl(key: string): Promise<number | null> {
		if (!this.client) {
			console.error('Cache connection not established')
			return null
		}
		const response = await this.client.ttl(key)
		return response
	}

	async deleteValue(key: string): Promise<boolean> {
		if (!this.client) {
			console.error('Cache connection not established')
			return false
		}
		const response = await this.client.del(key)
		return Boolean(response)
	}
}
