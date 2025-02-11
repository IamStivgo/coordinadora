export interface ICacheRepository {
    setValue(key: string, value: string, ttl?: number): Promise<boolean>
    getValue<T>(key: string): Promise<T | null>
    deleteValue(key: string): Promise<boolean>
}
