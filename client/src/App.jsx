import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// NAYA KAAM: loadUser import kiya backend sync ke liye
import { setAuthUser, loadUser } from './redux/authSlice' 
import { fetchCart } from './redux/cartSlice'

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setAuthUser(parsedUser));
      } catch (error) {
        console.error("Error syncing auth state:", error);
      }
    }
    
    // NAYA KAAM: Backend se fresh user data load karna
    // Taake agar token expire ho gaya ho ya data badal gaya ho toh sync ho jaye
    dispatch(loadUser());
  }, [dispatch]);

  // Cart Synchronization
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

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