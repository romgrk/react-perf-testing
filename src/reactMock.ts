/*
 * reactMock.ts
 */

let currentContext = null as any


export function resetContext() {
  currentContext = null as any
}

function nextContext() {
  if (!currentContext)
    return (currentContext = { value: null, next: null })
  return (currentContext = currentContext.next ??= { value: null, next: null })
}

export function useRef() {
  nextContext()
  return (currentContext.value ??= { current: null })
}

export function useState<T>(s: T): readonly [T, (v: T) => void] {
  nextContext()
  if (currentContext.value)
    return [currentContext.value[0], currentContext.value[1]]
  return (currentContext.value = [s, () => {}] as const)
}

export function useCallback(fn: Function, _d: any[]) {
  nextContext()
  return (currentContext.value ??= fn)
}
