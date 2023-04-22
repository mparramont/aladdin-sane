import {
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect } from 'react'
import type { LoaderFunction } from 'react-router-dom'
import { Form, Outlet, useLoaderData } from 'react-router-dom'
import { createAlbum, getAlbums } from '../albums'
import AlbumListItem from '../components/album-list-item'
import { LoaderData } from '../types/react-router-extra-types'

export const loader = (async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const albums = await getAlbums(q)
  return { albums, q }
}) satisfies LoaderFunction

export async function action() {
  const album = await createAlbum()
  return { album }
}

export default function Root() {
  const { albums, q }: { albums: Album[]; q: string | null } =
    useLoaderData() as LoaderData<typeof loader>

  useEffect(() => {
    // to fix, whenclicking back after a search, that the form field still haves the value the user entered even though the list is no longer filtered.
    // @ts-ignore TODO fix
    document.getElementById('q').value = q
  }, [q])
  return (
    <Container
      maxWidth="xl"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Celebrate David Bowie!</Typography>
            <Stack spacing={2}>
              <Form id="search-form" role="search">
                <TextField
                  id="q"
                  aria-label="Search albums"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  fullWidth
                />
                <div id="search-spinner" aria-hidden hidden>
                  <CircularProgress />
                </div>
                <div className="sr-only" aria-live="polite" />
              </Form>
              <Form method="post">
                <Button type="submit" variant="contained" color="primary">
                  New
                </Button>
              </Form>
            </Stack>
            <nav>
              {albums.length ? (
                <List>
                  {albums.map((album) => (
                    <AlbumListItem key={album.id} album={album} />
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  <i>No albums</i>
                </Typography>
              )}
            </nav>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Container>
            <Outlet />
          </Container>
        </Grid>
      </Grid>
    </Container>
  )
}
