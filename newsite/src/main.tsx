import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root.tsx'
import { createTheme } from '@mui/material';
import Shuriken from './fonts/Shuriken.ttf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Wagmi
import { WagmiProvider } from 'wagmi'
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { blastSepolia } from '@wagmi/core/chains'

import { injected } from 'wagmi/connectors'

// Pages
import Home from './pages/Home/Home.tsx';
import Auction from './pages/Auction/Auction.tsx';
import Manage from './pages/Manage/Manage.tsx';

// CSS
import './index.css'
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  typography: {
    fontFamily: 'Shuriken',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Shuriken';
          src: local('Shuriken'), local('Shuriken'), url(${Shuriken}) format('truetype');
        }
      `,
    },
  },
});

const config = createConfig({
  chains: [blastSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [blastSepolia.id]: http(),
    [localhost.id]: http()
  },
  connectors: [
    injected()
  ]
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // TODO: errorElement: <PageNotFound />,
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
      },
    ]
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
)
