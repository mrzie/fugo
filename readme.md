# Fugo

Sort of react hooks for rxjs. Designed to use rxjs easier in react component.

## Installation

```
npm i fugo --save
```

## API

### useObservable(maker: () => Observable<T>, initialState: T):T

- `maker` the function which returns an Observable instance.
- `initialState` 

Example: 
```javascript
// ...
import { useObservable } from 'fugo';

const App = () => {
    const count = useObservable(() => of(4), 0);
    // count is 4
    return <div>
        <p>{count}</p>
    </div>
};
```

### useEventHandler(defaultHandler?: (source: Observable) => void):[(e: E) => void, Subject<E>]
Returns a tuple of `[callback, subject]`. The subject emits first params of callback everytime the callback is called.

You can use `defaultHandler` to specificate the default subscription for subject.

```javascript
// ...
import { useEventHandler } from 'fugo';

const App = () => {
    const [onClick, click$] = useEventHandler();

    useEffect(() => {
        click$.subscribe(e => console.log(e));
    }, []);

    return <div>
        <button onClick={onClick}>click me!</button>
    </div>
};
```

### useBehaviorSubject(initValue: T): BehaviorSubject<T>
Returns a auto-complete BehaviorSubject instance.

```javascript
// ...
import { useBehaviorSubject, useObservable } from 'fugo';

const App = () => {
    const count$ = useBehaviorSubject(0);
    const isOdd = useObservable(() => count$.pipe(map(v => !!v & 1)), false);

    // ...
};
```

### useSubject(): Subject<T>
Just like `useBehaviorSubject` but returns Subject instance.

### useObservableFrom(input: T): Observable<T>
Returns an Observable instance which emit `input` value everytime the component render.
```javascript 
// ...
import { useObservableFrom } from 'fugo';

const MyComp = props => {
    const props$ = useObservableFrom(props);
    // ...
}
```

### useWhenLayout(builder: () => T):Subject<T>
Returns a Subject which emmits the return value of builder in `onLayoutEffect` stage. Almostly a syntactic sugar of `useEventCallback` and `onLayoutEffect`.
```javascript
// ...
import { useWhenLayout } from 'fugo';

const App = () => {
    const refRoot = useRef(null);
    const root$ = useWhenLayout(() => refRoot.current);

    return <div ref={refRoot}>
    
    </div>
}
```

### useListener(subscriptionMaker: () => Subscription)
Call `subscriptionMaker` once and automatically unsubscribe when component unmount.
```javascript
// ...
import { useListener } from 'fugo';

const App = () => {
    useListener(() => fromEvent(document, 'scroll').subscribe(e => {
        console.log('onScroll', e);
    }));
    // ... 
}

```


## Who is Fugo?
**Pannacotta Fugo**, a man from *Jojo's Bizarre Adventure: Golden Wind*, who acts intelligent and caring, but fights brainless and violently.
> *This ferocity! It strikes like a bomb, and departs like a storm... This Stand truly reflects the User's personality.*
>
> —Leone Abbacchio, Golden Wind