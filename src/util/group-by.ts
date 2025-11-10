export const groupBy = <T, K>(
    items: T[],
    getKey: (item: T) => K
): Map<K, T[]> => {
    const map = new Map<K, T[]>()
    for (const item of items) {
        const key = getKey(item)
        const group = map.get(key)
        if (group) {
            group.push(item)
        } else {
            map.set(key, [item])
        }
    }
    return map
}
