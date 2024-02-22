import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root.tsx'

// Pages
import Home from './pages/Home/Home.tsx';
import Auction from './pages/Auction/Auction.tsx';
import Manage from './pages/Manage/Manage.tsx';

// CSS
import './index.css'

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
    <RouterProvider router={router} />
  </React.StrictMode>
)
