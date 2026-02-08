import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <>
    <Toaster 
        position="top-center" reverseOrder={false} toastOptions={{duration: 4000, 
        style: {padding: '16px',borderRadius: '12px',background: '#F8FAFC',
        color: '#0F172A'},}} />
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default App