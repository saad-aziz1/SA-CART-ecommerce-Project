import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from './redux/authSlice'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // SHORT TRICK: 
    // Jab Google Login redirect karta hai, toh data aksar localStorage mein 
    // ya cookie mein pehle se save ho chuka hota hai backend ke zariye.
    // Hum check kar rahe hain ke agar storage mein user hai lekin Redux khali hai,
    // toh usey wapis synchronize kar do.
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Redux ke Bank (Store) ko foran update kar rahe hain
        dispatch(setAuthUser(parsedUser));
      } catch (error) {
        console.error("Error syncing auth state:", error);
      }
    }
  }, [dispatch]);

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000, 
          style: {
            padding: '16px',
            borderRadius: '12px',
            background: '#F8FAFC',
            color: '#0F172A'
          },
        }} 
      />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App