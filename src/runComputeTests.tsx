import { Chance } from 'chance'
import cx from 'clsx'
import { shallowEqual } from './utils/shallowEqual'
import * as React from './reactMock'

const c = new Chance()


const N = 100_000

export function runComputeTests() {
  runRenderTest(Component_0)
  runRenderTest(Component_5)
  runComparisonTest(0)
  runComparisonTest(5)
}

function runComparisonTest(length: number) {
  const aProps = Array.from({ length: N }).map(() => randomProps(length))
  const bProps = aProps.map(clone)

  const start = Date.now()

  let result = 0
  for (let i = 0; i < aProps.length; i++) {
    result += shallowEqual(aProps[i], bProps[i]) ? 1 : 0
  }

  const end = Date.now()
  const dt = end - start

  const nPerCompare = dt / N
  console.log(`Cost per props comparison (n=${length}):`, (nPerCompare) + 'ms')

  return result
}

function runRenderTest(C: Function) {
  const result = Array.from({ length: N }).fill(null)
  const start = Date.now()

  for (let i = 0; i < N; i++) {
    React.resetContext()
    result[i] = C({})
  }

  const end = Date.now()
  const dt = end - start
  const nPerCompare = dt / N

  console.log(`Cost per render (${C.name}):`, (nPerCompare) + 'ms')
}

function Component_0() {
  return (
    <span className='Test'>Hello world</span>
  )
}

function Component_5({ className, disabled, loading, value: valueProp, onChange: onChangeProp }: any) {
  const [value, setValue] = React.useState(valueProp)
  const onChange = (ev: any) => {
    valueProp !== undefined ? onChangeProp(ev.target.value) : setValue(ev.target.value)
  }
  return (
    <div className={cx('Input', className, { disabled, loading })}>
      {loading && <span>Spinner</span>}
      <input type='text' onChange={onChange} value={value} />
    </div>
  )
}


// Helpers

function clone(o: any) {
  const result = {} as any
  for (const key in o) {
    result[key] = o[key]
  }
  return result
}

function randomProps(length: number) {
  const result = {} as Record<string, any>
  for (let i = 0; i < length; i++) {
    result[c.word()] = randomValue()
  }
  return result
}

function randomValue() {
  switch (c.integer({ min: 0, max: 7 })) {
    case 0: return c.integer()
    case 1: return c.floating()
    case 2: return c.word()
    case 3: return c.bool()
    case 4: return null
    case 5: return undefined
    case 6: return {}
    case 7: return []
  }
}
