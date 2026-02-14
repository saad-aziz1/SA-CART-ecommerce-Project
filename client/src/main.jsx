import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SingUp.jsx'
import Products from './pages/Products.jsx'
import VerifyMsg from './pages/VerifyMsg.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import store from './redux/store'
import { Provider } from 'react-redux'
import ProductDetails from './pages/ProductDetails.jsx'
import AdminSidebar from './admin/AdminSidebar.jsx'
import AddProduct from './admin/AddProduct.jsx'
import AllProducts from './admin/AllProducts.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx' // Import Chowkidar
import AllUsers from './admin/AllUsers.jsx'
// --- CART PAGE IMPORT ---
import Cart from './pages/Cart.jsx' 
import Profile from './pages/Profile.jsx'
import UpdateProfile from './pages/UpdateProfile.jsx'

// --- ROUTER CONFIGURATION ---
const projectRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <LogIn />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/products',
        element: <Products />
      },
      // --- NAYA ROUTE: Search keyword ke liye ---
      {
        path: '/products/:keyword',
        element: <Products />
      },
      {
        path: '/verify',
        element: <VerifyMsg />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/product/:id',
        element: <ProductDetails />
      },
      // --- NEW CART ROUTE ---
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/update-profile',
        element: <UpdateProfile />
      },

      // --- PROTECTED ADMIN ROUTES ---
      {
        element: <ProtectedRoute isAdmin={true} />, // Protection Layer
        children: [
          {
            path: '/admin-sidebar',
            element: <AdminSidebar />,
            children: [
              {
                path: 'add-product', 
                element: <AddProduct />
              },
              {
                path: 'products', 
                element: <AllProducts />
              },
              {
                path: 'users', 
                element: <AllUsers />
              }
            ]
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={projectRouter} />
  </Provider>
)