import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiProvider } from 'wagmi'
import config from './wagmiConfig.js'

// Components
import Home from './pages/Home/Home.jsx'
import Auction from './pages/Auction/Auction.jsx';
import PageNotFound from './pages/PageNotFound/PageNotFound.jsx'
import Manage from './pages/Manage/Manage.jsx';
import Root from './components/Root/Root.jsx';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "auction",
        element: <Auction />
      },
      {
        path: "manage",
        element: <Manage />
      }
    ]
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </QueryClientProvider>
  </WagmiProvider>
  ,
)
