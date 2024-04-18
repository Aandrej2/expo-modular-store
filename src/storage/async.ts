import RNAsyncStorage from '@react-native-async-storage/async-storage';
import { StaticStorageItem, Storage, StorageItem } from './interface';
import { StaticStorageItemImpl, StorageItemImpl } from './implementation';

class AsyncStorageImpl<T extends {} = Record<string, any>> implements Storage<T> {
    async init() {
    }

    async getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        const item = await RNAsyncStorage.getItem(key.toString());
        return item ? JSON.parse(item) : null;
    }

    async setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        return RNAsyncStorage.setItem(key.toString(), JSON.stringify(item));
    }

    async removeItem(key: keyof T): Promise<void> {
        return RNAsyncStorage.removeItem(key.toString());
    }

    async clear(): Promise<void> {
        return RNAsyncStorage.clear();
    }

    keys(): Promise<(keyof T)[]> {
        return RNAsyncStorage.getAllKeys() as Promise<(keyof T)[]>;
    }

    async multiGet<K extends keyof T>(keys: K[]): Promise<(T[K] | null)[]> {
        const items = await RNAsyncStorage.multiGet(keys.map(key => key.toString()));
        return items.map(([, item]) => item ? JSON.parse(item) : null);
    }

    Item<K extends keyof T>(key: K): StorageItem<T[K]> {
        return new StorageItemImpl<T, K>(key, this);
    }

    StaticItem<K extends keyof T>(key: K): StaticStorageItem<T[K]> {
        return new StaticStorageItemImpl<T, K>(key, this);
    }
}

export const createAsyncStorage = <T extends {} = Record<string, any>>() => new AsyncStorageImpl();
