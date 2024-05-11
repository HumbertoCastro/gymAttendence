import './App.css'
import MainPage from './pages/Main'
import DenseAppBar from './components/AppBar'
import { useState } from 'react'
import GeneralInfo from './pages/Generalnfo';
import Login from './pages/Login/Login';

function App() {
  const [email, setEmail] = useState('dedebarbos@hotmail.com');
  const [logged, setLogged] = useState('dedebarbos@hotmail.com');

  return (
    <>
      {
        email !== 'unlogged' && <DenseAppBar setName={setEmail} email={email} />
      }
      {
        email === 'unlogged' ? <Login callbackEmail={setEmail} setLogged={setLogged} /> : email !== 'Geral' ? <MainPage currentUser={email} logged={logged} /> : <GeneralInfo />
      }      
    </>
  )
}

export default App
