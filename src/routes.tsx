import ErrorPage from './error-page'
import './index.css'
import Album from './routes/album'
import Root from './routes/root'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/albums/:albumId',
        element: <Album />
      }
    ]
  }
]
