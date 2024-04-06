import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import createStore from 'react-auth-kit/createStore';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import Pages
import ErrorPage from './Pages/ErrorPage.tsx'
import HomePage from './Pages/HomePage.tsx';
import LoginPage from './Pages/LoginPage.tsx';
import InfoPage from './Pages/InfoPage.tsx';
import AddAppPage from './Pages/AddAppPage.tsx';
import FeedbackPage from './Pages/FeedbackPage.tsx';


// CSS
import "bootstrap/dist/css/bootstrap.css"
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <InfoPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/home",
    element:
      <RequireAuth fallbackPath={'/login'}>
        <HomePage />
      </RequireAuth>,
    errorElement: <ErrorPage />
  },
  {
    path: "/add_app",
    element:
      <RequireAuth fallbackPath={'/login'}>
        <AddAppPage />
      </RequireAuth>,
    errorElement: <ErrorPage />
  },
  {
    path: "/feedback",
    element:
        <FeedbackPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);

const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
