import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux' // useSelector add kiya
import { setAuthUser } from './redux/authSlice'
import { fetchCart } from './redux/cartSlice' // fetchCart import kiya

function App() {
  const dispatch = useDispatch();
  // NAYA KAAM: Auth state se user nikala
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
  }, [dispatch]);

  // NAYA KAAM: Cart Synchronization
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