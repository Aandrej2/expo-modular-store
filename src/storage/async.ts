import { Storage as ExpoStorage } from 'expo-storage';
import { StaticStorageItem, Storage, StorageItem } from './interface';
import { StaticStorageItemImpl, StorageItemImpl } from './implementation';

class AsyncStorageImpl<T extends {} = Record<string, any>> implements Storage<T> {
    async init() {
    }

    async getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        const item = await ExpoStorage.getItem({ key: key.toString() });
        return item ? JSON.parse(item) : null;
    }

    async setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        return ExpoStorage.setItem({ key: key.toString(), value: JSON.stringify(item) });
    }

    async removeItem(key: keyof T): Promise<void> {
        return ExpoStorage.removeItem({ key: key.toString() });
    }

    async clear(): Promise<void> {
        for (const key of await this.keys()) {
            await this.removeItem(key);
        }
    }

    keys(): Promise<(keyof T)[]> {
        return ExpoStorage.getAllKeys() as Promise<(keyof T)[]>;
    }

    async multiGet<K extends keyof T>(keys: K[]): Promise<(T[K] | null)[]> {
        return Promise.all(keys.map((key) => this.getItem(key)));
    }

    Item<K extends keyof T>(key: K): StorageItem<T[K]> {
        return new StorageItemImpl<T, K>(key, this);
    }

    StaticItem<K extends keyof T>(key: K): StaticStorageItem<T[K]> {
        return new StaticStorageItemImpl<T, K>(key, this);
    }
}

export const createAsyncStorage = <T extends {} = Record<string, any>>() => new AsyncStorageImpl();
