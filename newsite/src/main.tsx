import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root.tsx'
import { createTheme } from '@mui/material';
import Shuriken from './fonts/Shuriken.ttf';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
