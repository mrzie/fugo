# Changelog

## [0.2.0] - 2025-07-01

### Breaking Changes

- **useObservable**: `initValue` parameter now requires a function `() => T`
- **useBehaviorSubject**: `initValue` parameter now requires a function `() => T`  
- **useListener**: Added required `deps` parameter for dependency tracking

### New Features

- React 18 concurrent mode compatibility

### Bug Fixes

- **useEventHandler**: Fixed issue where `defaultHandler` was not being called
- **useEventHandler**: Fixed subscription cleanup to prevent memory leaks

---

## [0.1.3] - 2022-01-11

### Fixed

- `useObservable` will now trigger re-render while passing a cold observable.