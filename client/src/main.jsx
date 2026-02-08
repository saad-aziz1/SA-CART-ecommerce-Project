import { createBrowserRouter,  RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SingUp.jsx'
import Products from './pages/Products.jsx'
import VerifyMsg from './pages/VerifyMsg.jsx'




const projectRouter = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
          {
        path:'/login',
        element:<LogIn/>
      },
          {
        path:'/signup',
        element:<SignUp/>
      },
      {
        path:'/products',
        element:<Products/>
      },
      {
        path:'/verify',
        element:<VerifyMsg/>
      }
      
  ]
  }
])



createRoot(document.getElementById('root')).render(

  <RouterProvider router={projectRouter}/>
  
)
