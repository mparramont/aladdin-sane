import type { LoaderFunction } from 'react-router-dom'
import { Link, Outlet, useLoaderData, Form } from 'react-router-dom'
import { getAlbums, createAlbum } from '../albums'
import { LoaderData } from '../types/react-router-extra-types'

export const loader = (async () => {
  const albums = await getAlbums()
  return { albums }
}) satisfies LoaderFunction

export async function action() {
  const album = await createAlbum()
  return { album }
}

export default function Root() {
  const { albums }: { albums: Album[] } = useLoaderData() as LoaderData<
    typeof loader
  >
  return (
    <>
      <div id="sidebar">
        <h1>Celebrate David Bowie! </h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search albums"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden />
            <div className="sr-only" aria-live="polite" />
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {albums.length ? (
            <ul>
              {albums.map((album) => (
                <li key={album.id}>
                  <Link to={`albums/${encodeURIComponent(album.id)}`}>
                    {album.name ? album.name : <i>No Name</i>}{' '}
                    {album.favorite && <span>★</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No albums</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  )
}
