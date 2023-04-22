import { MusicNote } from '@mui/icons-material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { Form, LoaderFunction, Params, useLoaderData } from 'react-router-dom'
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
      album.image.find((image: LastFMImage) => image.size === 'extralarge')?.[
        '#text'
      ] || album.image[album.image.length - 1]?.['#text']
    )
  }
  const albumImageURL = getAlbumImageURL()

  // Inside the component
  return (
    <Card id="album" sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
      <CardMedia
        component="img"
        image={albumImageURL}
        alt={(album.name && `${album.name} cover`) || 'No Album Name'}
      />

      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" component="div">
            {album.name || <i>No Album Name</i>}
          </Typography>
          <Favorite album={album} />
        </Box>

        {/* TODO link to artist */}
        {album.artist && <Typography>{album.artist.name}</Typography>}

        {album.wiki?.summary && (
          <Typography
            component="p"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {album.wiki.summary}
          </Typography>
        )}

        {album.tracks && (
          <List>
            {album.tracks.track.map((track: LastFMTrack, index: number) => (
              <ListItem key={track.mbid || track.name}>
                <ListItemIcon>
                  <MusicNote />
                </ListItemIcon>
                <ListItemText primary={`${index + 1}. ${track.name}`} />
              </ListItem>
            ))}
          </List>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Form action="edit">
            <Button type="submit" variant="outlined">
              Edit
            </Button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              // eslint-disable-next-line no-restricted-globals
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <Button type="submit" variant="outlined" color="error">
              Delete
            </Button>
          </Form>
        </Stack>
      </CardContent>
    </Card>
  )
}

function Favorite({ album }: { album: Album }) {
  const { favorite } = album
  return (
    <Form method="post">
      <IconButton
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>
    </Form>
  )
}
