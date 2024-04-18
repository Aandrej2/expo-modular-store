import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import { BaseStorage, Storage } from './interface';
import { applyStorageMixins } from './apply-storage-mixins';
import { CachedStorageMixin } from './mixins/cached';

class SecureStorageImpl<T extends {} = Record<string, any>> implements BaseStorage<T> {
    async getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        const item = await getItemAsync(key.toString());
        return item ? JSON.parse(item) : null;
    }

    async setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        return setItemAsync(key.toString(), JSON.stringify(item));
    }

    async removeItem(key: keyof T): Promise<void> {
        return deleteItemAsync(key.toString());
    }
}

export const createSecureStorage = <T extends {} = Record<string, any>>(): Storage<T> =>
    applyStorageMixins([
            CachedStorageMixin(),
        ],
        new SecureStorageImpl(),
    );

