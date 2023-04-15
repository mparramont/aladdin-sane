import { render } from '@testing-library/react'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { routes } from '../routes'

const router = createMemoryRouter(routes)

test('renders album information', async () => {
  const { getByText } = render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
  // FIXME this is testing more than the unit under test, since it's also testing the root component by clicking on it.
  // TODO test the root component separately
  await userEvent.click(getByText('David Bowie (1969)'))

  const albumTitle = getByText('David Bowie (aka Space Oddity) [2015 Remaster]')
  const artistName = getByText('David Bowie')
  const summary = getByText(/David Bowie \(commonly known as Space Oddity\)/i)

  expect(albumTitle).toBeInTheDocument()
  expect(artistName).toBeInTheDocument()
  expect(summary).toBeInTheDocument()
})
