import {DependencyList, useEffect, useMemo, useSyncExternalStore, useRef, useLayoutEffect, useCallback} from 'react';
import {BehaviorSubject, distinctUntilChanged, Observable, Subject, Subscription} from 'rxjs';

export const useObservable = <T>(maker: () => Observable<T>, initValue: () => T) => {
    const state$ = useBehaviorSubject(() => initValue());
    const makerRef = useRef(maker);

    useEffect(() => {
        // 不直接subscribe(state$)是因为上游error会通过useSyncExternalStore抛出
        const $$ = makerRef.current().subscribe(next => state$.next(next));

        return () => $$.unsubscribe();
    }, [state$]);

    const state = useSyncExternalStore(
        onChange => {
            const $$ = state$.subscribe(() => {
                onChange();
            });
            return () => $$.unsubscribe();
        },
        () => state$.getValue()
    );

    return state;
};

export const useBehaviorSubject = <T>(initValue: () => T) => {
    const subjectRef = useRef<BehaviorSubject<T>>(undefined!);
    const isMounted = useRef(false);

    // 每次重新挂载时创建新实例
    if (!isMounted.current) {
        subjectRef.current = new BehaviorSubject<T>(initValue());
        isMounted.current = true;
    }

    useEffect(() => {
        return () => {
            // 真实卸载时执行清理
            isMounted.current = false;
            subjectRef.current?.complete();
        };
    }, []);

    return subjectRef.current!;
};
export const useSubject = <T>() => {
    const subjectRef = useRef<Subject<T>>(undefined!);
    const isMounted = useRef(false);

    // 每次重新挂载时创建新实例
    if (!isMounted.current) {
        subjectRef.current = new Subject<T>();
        isMounted.current = true;
    }

    useEffect(() => {
        return () => {
            // 真实卸载时执行清理
            isMounted.current = false;
            subjectRef.current?.complete();
        };
    }, []);

    return subjectRef.current!;
};

export const useEventHandler = <Event>(defaultHandler?: (source: Observable<Event>) => Subscription | void) => {
    const subject = useSubject<Event>();
    const callback = useCallback((e: Event) => subject.next(e), [subject]);
    const defaultHandlerRef = useRef(defaultHandler);
    useEffect(() => {
        const handler = defaultHandlerRef.current;
        if (handler instanceof Function) {
            const subscription = handler(subject);
            if (subscription instanceof Subscription) {
                return () => subscription.unsubscribe();
            }
        }
    }, [subject]);
    return [callback, subject] as [typeof callback, Subject<Event>];
};

export const useObservableFrom = <T>(value: T) => {
    const subject$ = useSubject<T>();
    const subjectRef = useRef(subject$);

    useEffect(() => {
        subjectRef.current.next(value);
    }, [value]);

    return useMemo(() => {
        return subjectRef.current.pipe(distinctUntilChanged());
    }, []);
};

export const useWhenLayout = <T>(builder: () => T) => {
    const subject = useSubject<T>();
    useLayoutEffect(() => subject.next(builder()));
    return subject;
};

export const useListener = (subscriptionMaker: () => Subscription, deps: DependencyList) => {
    return useEffect(() => {
        const subscription = subscriptionMaker();
        return () => {
            subscription.unsubscribe();
        };
    }, deps);
};