import { useState, useMemo, useEffect, useLayoutEffect, useCallback, Dispatch, SetStateAction } from "react";
import { Observable, BehaviorSubject, Subject, Subscription } from "rxjs";

export const useObservable = <T>(maker: () => Observable<T>, initValue: T) => {
    const [state, setState] = useState(initValue);
    useEffect(() => {
        const subscription = maker().subscribe(v => setState(v));

        return () => subscription.unsubscribe();
    }, []);

    return value;
};

export const useEventHandler = <Event>(defaultHandler?: (source: Observable<Event>) => Subscription | void) => {
    const subject = useMemo(() => new Subject<Event>(), []);
    const callback = useCallback((e: Event) => subject.next(e), []);
    useEffect(() => {
        if (defaultHandler instanceof Function) {
            defaultHandler(subject);
        }
        return () => subject.complete();
    }, []);
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
    useEffect(() => subject$.next(inputs), [inputs]);
    return useMemo(() => subject$.asObservable(), []);
};

export const useWhenLayout = <T>(builder: () => T) => {
    const subject = useMemo(() => new Subject<T>(), []);
    useLayoutEffect(() => subject.next(builder()));
    useEffect(() => () => subject.complete(), []);
    return subject;
};

export const useListener = (subscriptionMaker: () => Subscription) => {
    useEffect(() => {
        const subscription = subscriptionMaker();
        return () => subscription.unsubscribe();
    }, []);
};