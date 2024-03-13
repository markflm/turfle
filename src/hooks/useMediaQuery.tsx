import React from 'react'

export function useCustomMediaQuery(query: string) {
    const subscribe = React.useCallback(
        (callback: () => void) => {
            const matchMedia = window.matchMedia(query)

            matchMedia.addEventListener('change', callback)
            return () => {
                matchMedia.removeEventListener('change', callback)
            }
        },
        [query]
    )
    const getSnapshot = () => {
        return window.matchMedia(query).matches
    }

    return React.useSyncExternalStore(subscribe, getSnapshot)
}
