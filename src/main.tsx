// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "modern-normalize";
import './index.css'
import App from './components/App/App'
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster position="top-center" />
    <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
)
