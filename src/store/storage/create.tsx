import React, {Dispatch, PropsWithChildren, SetStateAction, useEffect} from 'react';
import { LoadHandler, SaveHandler, StorageStore, StorageStoreImplConfig } from './types';
import { createMemoryStore } from '../memory/create';

export const createStorageStoreImpl = <T extends {}>(
    defaultValue: T,
    {storage, storageManagerHandler}: StorageStoreImplConfig<T>,
): StorageStore<T> => {
    const memoryStore = createMemoryStore(defaultValue);

    const load: LoadHandler<T> = (setValueState: Dispatch<SetStateAction<T>>) => {
        return storage.get()
            .then(value => {
                if (value)
                    setValueState(value);

                return value;
            });
    };

    const save: SaveHandler<T> = (valueState: T) => {
        return storage.set(valueState);
    };

    const StorageManager: React.FC<PropsWithChildren> = ({children}) => {
        const [valueState, setValueState] = memoryStore.useContext();

        useEffect(() => {
            load(setValueState);
        }, []);

        storageManagerHandler({
            valueState,
            setValueState,
            load,
            save,
        });

        return <>{children}</>;
    };

    const Provider: React.FC<PropsWithChildren> = ({children}) => (
        <memoryStore.Provider>
            <StorageManager>
                {children}
            </StorageManager>
        </memoryStore.Provider>
    );

    const useSaveValue = <K extends keyof T>(key: K) => {
        const [valueState, setValueState] = memoryStore.useContext();

        return (value: T[K]) => {
            const newValueState = {
                ...valueState,
                [key]: value,
            };

            setValueState(newValueState);
            return save(newValueState);
        };
    };

    return {
        Provider,
        useContext: memoryStore.useContext,
        useValue: memoryStore.useValue,
        useSaveValue,
        useSave() {
            const [valueState] = memoryStore.useContext();
            return () => save(valueState);
        },
    };
};
