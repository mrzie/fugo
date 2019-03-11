import { useState, useMemo, useEffect, useLayoutEffect, useCallback , Dispatch, SetStateAction} from "react";
import { Observable, BehaviorSubject, Subject, Subscription } from "rxjs";

export const useObservable = <T>(maker: () => Observable<T>, initValue: T) => {
    let value: T, setValue: Dispatch<SetStateAction<T>>;
    const [initialState, subscription] = useMemo(() => {
        let initialState = initValue;
        const source = maker();
        let setter = (v: T) => {
            if (!setValue) {
                initialState = v;
            } else {
                setValue(v);
                setter = setValue;
            }
        };
        const subscription = source.subscribe(v => setter(v));

        return [initialState, subscription] as [T, Subscription];
    }, []);
    [value, setValue] = useState(initialState);

    useEffect(() => () => subscription.unsubscribe(), []);

    return value;
};

export const useEventHandler = <Event>() => {
    const subject = useMemo(() => new Subject<Event>(), []);
    const callback = useCallback((e: Event) => subject.next(e), []);
    useEffect(() => () => subject.complete(), []);
    return [callback, subject] as [typeof callback, Subject<Event>];
};

export const useBehaviorSubject = <T>(initValue: T) => {
    const subject = useMemo(() => new BehaviorSubject(initValue), []);

    useEffect(() => () => subject.complete(), []);
    return subject;
};

export const useSubject = <T>() => {
    const subject = useMemo(() => new Subject<T>(), []);

    useEffect(() => () => subject.complete(), []);
    return subject;
};

export const useObservableFrom = <T>(inputs: T) => {
    const subject$ = useBehaviorSubject(inputs);
    useMemo(() => subject$.next(inputs), [inputs]);
    return useMemo(() => subject$.asObservable(), []);
};

export const useWhenLayout = <T>(builder: () => T) => {
    const subject = useMemo(() => new Subject<T>(), []);
    useLayoutEffect(() => subject.next(builder()));
    useEffect(() => () => subject.complete(), []);
    return subject;
};

export const useListener = (subscriptionMaker: () => Subscription) => {
    const subscription = useMemo(subscriptionMaker, []);
    useEffect(() => () => subscription.unsubscribe(), []);
};