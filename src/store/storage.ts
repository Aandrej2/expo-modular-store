import {createStorageStoreImpl, StorageItem, StorageManagerHandlerHelpers, StorageStore} from 'react-modular-store';
import {AppState, AppStateStatus} from 'react-native';
import {useEffect} from 'react';

export type StorageStoreConfig<T> = {
    storage: StorageItem<T>,
    saveBehavior: keyof typeof storageManagerHandler,
};

const storageManagerHandler = {
    manual<T extends {}>(options: StorageManagerHandlerHelpers<T>) {
    },

    onScreenChange<T extends {}>({save, valueState}: StorageManagerHandlerHelpers<T>) {
        useEffect(() => {
            const onAppStateChange = (appState: AppStateStatus) => {
                if (appState !== 'active')
                    save(valueState);
            };

            const subscription = AppState.addEventListener('change', onAppStateChange);
            return () => {
                subscription.remove();
            };
        }, [valueState]);
    },

    onWrite<T extends {}>({save, valueState}: StorageManagerHandlerHelpers<T>) {
        useEffect(() => {
            save(valueState);
        }, [valueState]);
    },
} as const;

export const createStorageStore = <T extends {}>(
    defaultValue: T,
    {storage, saveBehavior}: StorageStoreConfig<T>,
): StorageStore<T> => createStorageStoreImpl(defaultValue, {
    storage,
    storageManagerHandler: storageManagerHandler[saveBehavior],
});
