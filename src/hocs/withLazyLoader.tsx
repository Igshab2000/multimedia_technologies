import React from "react";
import { lazy, Suspense, ComponentType } from "react";
import { Spinner } from "../components/Spinner/Spinner";

const withLazyLoader = <T extends () => Promise<{ default: ComponentType<any> }>>(Component: T) => {
    const LazyComponent = lazy(Component);

    type TLazy = T extends () => Promise<{ default: infer C }>
        ? C extends ComponentType<infer P>
            ? [C, P]
            : never
        : never;
    
    const LComponent: TLazy[0] = (props: TLazy[1]) => (
        <Suspense fallback={<Spinner />}>
            <LazyComponent {...props} />
        </Suspense>
    );

    return LComponent;
};

export default withLazyLoader;
