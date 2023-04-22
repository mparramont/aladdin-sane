import ErrorPage from './error-page'
import './index.css'
import Album, { loader as albumLoader } from './routes/album'
import Root, { action as rootAction, loader as rootLoader } from './routes/root'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: '/albums/:albumId',
        element: <Album />,
        loader: albumLoader
      }
    ]
  }
]
