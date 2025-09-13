import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BackgroundLocationProvider } from './context/BackgroundLocation.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeroUIProvider } from "@heroui/react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/tailwind.css'
import './styles/figma.css'
import './styles/global.css'

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider theme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BackgroundLocationProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </BackgroundLocationProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
