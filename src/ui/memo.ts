import * as React from 'react'
import * as standard from './standard'

const components = { ...standard } as any

for (const name in components) {
  components[name] = React.memo(components[name])
}

const exports = components as typeof standard

export default exports
