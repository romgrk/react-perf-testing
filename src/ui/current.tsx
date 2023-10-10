
type UIComponents = typeof import('./standard')

let current: UIComponents

export const ui = new Proxy({}, {
  get: (_, key, __) => {
    return current![key as keyof UIComponents]
  }
}) as UIComponents

export function set(components: UIComponents) {
  current = components
}
