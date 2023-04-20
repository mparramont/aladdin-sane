import ErrorPage from './error-page'
import './index.css'
import Album from './routes/album'
import Root, { loader as rootLoader, action as rootAction } from './routes/root'

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
        element: <Album />
      }
    ]
  }
]
