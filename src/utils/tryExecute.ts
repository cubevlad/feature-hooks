import { isPromise } from './isPromise';

type DefaultValue<T> = T | ((err: unknown) => T)

export function tryExecute<T, K>(value: () => T, defaultValue: DefaultValue<K>): T | K

export function tryExecute<T>(value: () => T): T | undefined

export function tryExecute<T, K>(
    value: Promise<T> | (() => Promise<T>),
    defaultValue: DefaultValue<K>,
): Promise<T | K>

export function tryExecute<T>(value: Promise<T> | (() => Promise<T>)): Promise<T | undefined>

export function tryExecute<T, K>(
    value: (() => T) | Promise<T> | (() => Promise<T>),
    defaultValue?: DefaultValue<K>,
): T | K | undefined | Promise<T | K | undefined> {
    const onCatch = (err: unknown): K | undefined => {
        return typeof defaultValue === 'function'
            ? (defaultValue as (err: unknown) => K | undefined)(err)
            : defaultValue
    }

    try {
        const unwrappedValue = typeof value === 'function' ? value() : value

        if (isPromise(unwrappedValue)) {
            return new Promise((resolve) => {
                return (
                    unwrappedValue
                        // @ts-ignore
                        .then((value) => {
                            resolve(value)
                        })
                        // @ts-ignore
                        .catch((err) => {
                            resolve(onCatch(err))
                        })
                )
            })
        }

        return unwrappedValue
    } catch (err) {
        return onCatch(err)
    }
}