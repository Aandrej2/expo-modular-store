import React, { PropsWithChildren } from 'react';

export const reduceStoreProviders = (providers: React.FC<PropsWithChildren>[]): React.FC<PropsWithChildren> => (
    ({children}) => (
        <>
            {providers.reduceRight((children, Provider) => (
                    <Provider>
                        {children}
                    </Provider>
                ),
                children,
            )}
        </>
    )
);
