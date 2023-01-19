import { Habit } from './components/Habit'
import './styles/global.css'

function App() {
  return (
    <div>
      <Habit completed={2}/>
      <Habit completed={5}/>
    </div>
  )
}

export default App