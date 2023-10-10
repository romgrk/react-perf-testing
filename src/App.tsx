import { useState } from 'react'
import * as current from './ui/current'
import * as standard from './ui/standard'
import memo from './ui/memo'
import { runComputeTests } from './runComputeTests'
import './ui/styles.scss'

current.set(standard)

const ui = current.ui

const UI_BY_NAME = {
  none: null,
  standard: standard,
  memo: memo,
}
type UIName = keyof typeof UI_BY_NAME

function App() {
  const [uiName, setUIName] = useState('none' as UIName) 

  const run = (name: UIName) => {
    if (UI_BY_NAME[name]) {
      current.set(UI_BY_NAME[name]!)
    }
    performance.mark('START_RENDER')
    setUIName(name)
  }

  return (
    <ui.Box className='App' vertical>
      <div>
        <h1>React perf testing (current: {uiName})</h1>
        <ui.Box padding={1}>
          <ui.Button onClick={() => run('none')}>Render NONE</ui.Button>
          <span>&nbsp;</span>
          <ui.Button onClick={() => run('standard')}>Render STANDARD</ui.Button>
          <span>&nbsp;</span>
          <ui.Button onClick={() => run('memo')}>Render MEMO</ui.Button>
        </ui.Box>
        <ui.Box padding={1}>
          <ui.Button onClick={runComputeTests}>Run COMPUTE TESTS</ui.Button>
        </ui.Box>
      </div>

      {uiName !== 'none' &&
        <ui.Dashboard key={uiName} />
      }
    </ui.Box>
  )
}

export default App
