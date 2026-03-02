import { Storage as ExpoStorage } from 'expo-storage';
import { StaticStorageItem, Storage, StorageItem } from './interface';
import { StaticStorageItemImpl, StorageItemImpl } from './implementation';

class AsyncStorageImpl<T extends {} = Record<string, any>> implements Storage<T> {
    async init() {
    }

    async getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        try {
            const item = await ExpoStorage.getItem({ key: key.toString() });
            return item ? JSON.parse(item) : null;
        } catch (error) {
            return null;
        }
    }

    async setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        try {
            return ExpoStorage.setItem({ key: key.toString(), value: JSON.stringify(item) });
        } catch (error) {
            // Handle error if needed
        }
    }

    async removeItem(key: keyof T): Promise<void> {
        try {
            return ExpoStorage.removeItem({ key: key.toString() });
        } catch (error) {
            // Handle error if needed
        }
    }

    async clear(): Promise<void> {
        for (const key of await this.keys()) {
            await this.removeItem(key);
        }
    }

    keys(): Promise<(keyof T)[]> {
        try {
            return ExpoStorage.getAllKeys() as Promise<(keyof T)[]>;
        } catch (error) {
            return new Promise((resolve) => resolve([]));
        }
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
