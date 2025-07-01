# Fugo

React hooks for RxJS. Bridge the reactive world with React components seamlessly.

## Quick Start

```bash
npm install fugo
```

```javascript
import { useObservable } from 'fugo';
import { interval } from 'rxjs';

function Timer() {
  const count = useObservable(() => interval(1000), () => 0);
  return <div>Timer: {count}</div>;
}
```

## Core Concepts

Fugo provides hooks that make RxJS observables work naturally with React's lifecycle and state management. Each hook handles subscription/unsubscription automatically.

## API Reference

### useObservable

Subscribe to an Observable and get its latest value as React state.

```typescript
useObservable<T>(maker: () => Observable<T>, initialValue: () => T): T
```

**Example**: Timer with interval
```javascript
const count = useObservable(
  () => interval(1000),
  () => 0
);
```

### useEventHandler

Create event handlers that emit to RxJS streams.

```typescript
useEventHandler<T>(defaultHandler?: (source: Observable<T>) => Subscription): [
  (event: T) => void, 
  Subject<T>
]
```

**Example**: Debounced search
```javascript
const [onSearch, search$] = useEventHandler(
  source => source.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(query => setResults(search(query)))
);

return <input onChange={e => onSearch(e.target.value)} />;
```

### useBehaviorSubject

Create a BehaviorSubject that's cleaned up automatically.

```typescript
useBehaviorSubject<T>(initialValue: () => T): BehaviorSubject<T>
```

**Example**: Derived state with operators
```javascript
const count$ = useBehaviorSubject(() => 0);
const isOdd = useObservable(
  () => count$.pipe(map(v => v % 2 === 1)),
  () => false
);
```

### useSubject

Create a Subject that's cleaned up automatically.

```typescript
useSubject<T>(): Subject<T>
```

### useObservableFrom

Convert any value to an Observable that emits on every render.

```typescript
useObservableFrom<T>(value: T): Observable<T>
```

**Example**: React props to Observable
```javascript
const props$ = useObservableFrom(props);
const derived = useObservable(
  () => props$.pipe(map(p => p.name.toUpperCase())),
  () => ''
);
```

### useWhenLayout

Emit values during layout effects.

```typescript
useWhenLayout<T>(builder: () => T): Subject<T>
```

**Example**: DOM measurements
```javascript
const ref = useRef();
const size$ = useWhenLayout(() => ref.current?.getBoundingClientRect());
```

### useListener

Subscribe to an Observable with dependency tracking.

```typescript
useListener(maker: () => Subscription, deps: DependencyList): void
```

**Example**: Global event handling
```javascript
useListener(
  () => fromEvent(window, 'resize').subscribe(updateLayout),
  []
);
```

## Migration from 0.1.x

- `useObservable(maker, value)` → `useObservable(maker, () => value)`
- `useBehaviorSubject(value)` → `useBehaviorSubject(() => value)`
- `useListener(maker)` → `useListener(maker, [])`

---

## Who is Fugo?

**Pannacotta Fugo**, a character from *Jojo's Bizarre Adventure: Golden Wind*, who acts intelligent and caring, but fights brainless and violently.

> *This ferocity! It strikes like a bomb, and departs like a storm... This Stand truly reflects the User's personality.*
>
> —Leone Abbacchio, Golden Wind