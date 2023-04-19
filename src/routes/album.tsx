import { Form } from 'react-router-dom'
import styled from 'styled-components'
import { davidBowie1969Album } from '../data/albums/davidBowie1969Album'

export default function Album() {
  const album = davidBowie1969Album

  // TODO extract to function
  const albumImageURL =
    album.image.find((image) => image.size === 'extralarge')?.['#text'] ||
    album.image[album.image.length - 1]?.['#text']

  return (
    <div id="album">
      <div>
        <img
          key={albumImageURL}
          src={albumImageURL}
          alt={(album.name && `${`${album.name} cover`}`) || 'No Album Name'}
        />
      </div>

      <div>
        <h1>
          {album.name || <i>No Album Name</i>} <Favorite album={album} />
        </h1>

        {/* TODO link to artist */}
        {album.artist && <p>{album.artist.name}</p>}

        {album.wiki?.summary && (
          <AlbumSummary>{album.wiki.summary}</AlbumSummary>
        )}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              // TODO make it nicer if we use some design library
              // eslint-disable-next-line no-restricted-globals
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({ album }: { album: Album }) {
  const { favorite } = album
  return (
    <Form method="post">
      {/* disable because we're using a react-router-dom Form */}
      {/* eslint-disable-next-line react/button-has-type */}
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  )
}

const AlbumSummary = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`
