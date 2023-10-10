import * as current from './ui/current'
import * as standard from './ui/standard'
import './ui/styles.scss'

current.set(standard)

const ui = current.ui

function App() {

  return (
    <ui.Box className='App' vertical>
      <h1>React perf testing</h1>

      <ui.Dashboard />
    </ui.Box>
  )
}

export default App
