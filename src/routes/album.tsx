import type { LoaderFunction, Params } from 'react-router-dom'
import { Form, useLoaderData } from 'react-router-dom'
import styled from 'styled-components'
import { getAlbum } from '../albums'
import { LoaderData } from '../types/react-router-extra-types'

export const loader: LoaderFunction = async ({
  params
}: {
  params: Params
}) => {
  const albumId = params.albumId as AlbumID
  const album = await getAlbum(albumId)
  return { album }
}

export default function Album() {
  const { album } = useLoaderData() as LoaderData<typeof loader>

  function getAlbumImageURL() {
    if (!album.image) return undefined
    return (
      album.image.find(
        (image: LastFMAlbumImage) => image.size === 'extralarge'
      )?.['#text'] || album.image[album.image.length - 1]?.['#text']
    )
  }
  const albumImageURL = getAlbumImageURL()

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
        <TitleWrapper>
          <AlbumName>{album.name || <i>No Album Name</i>}</AlbumName>
          <Favorite album={album} />
        </TitleWrapper>

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
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const AlbumName = styled.h1`
  flex-grow: 1;
`

const AlbumSummary = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`
