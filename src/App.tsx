import './App.css'
import MainPage from './pages/Main'
import DenseAppBar from './components/AppBar'
import { useState } from 'react'
import GeneralInfo from './pages/Generalnfo';

function App() {
  const [name, setName] = useState('Geral');
  console.log(name)
  return (
    <>
      <DenseAppBar setName={setName} name={name} />
      {
        name !== 'Geral' ? <MainPage currentUser={name} /> : <GeneralInfo />
      }
      
    </>
  )
}

export default App
