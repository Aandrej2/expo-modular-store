import React, {Dispatch, PropsWithChildren, SetStateAction} from 'react';
import { StorageItem } from '../../storage/interface';

export type StoreConfig<T> = {
    storage?: StorageItem<T>,
};

export type Store<T> = {
    Provider: React.FC<PropsWithChildren>,
    useContext: () => [
        T,
        Dispatch<SetStateAction<T>>,
        <K extends keyof T>(key: K, value: T[K]) => void | Promise<void>,
    ],
    useValue: <K extends keyof T>(key: K) => [T[K], ((newValue: T[K]) => void | Promise<void>)],
};