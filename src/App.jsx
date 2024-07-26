import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/app-layout'
import LandingPage from './pages/landing'
import Auth from './pages/auth'
import Dashboard from './pages/dashboard'
import RedirectLink from './pages/redirect-link'
import Link from './pages/link'
import { UrlProvider } from './context/context'
import RequireAuth from './components/RequireAuth'

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <LandingPage />
        },
        {
          path: '/auth',
          element: <Auth />
        },
        {
          path: '/dashboard',
          element: (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          )
        },
        {
          path: '/link/:id',
          element: (
            <RequireAuth>
              <Link />
            </RequireAuth>
          )
        },
        {
          path: '/:id',
          element: <RedirectLink />
        },
      ]
    }
  ])

  return (
    <UrlProvider>
      <RouterProvider router={router}></RouterProvider>
    </UrlProvider>
  )
}

export default App
