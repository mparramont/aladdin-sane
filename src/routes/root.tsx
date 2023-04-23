import {
  AppBar,
  CircularProgress,
  Container,
  Grid,
  List,
  Paper,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { useEffect } from 'react'
import type { LoaderFunction } from 'react-router-dom'
import { Form, Outlet, useLoaderData } from 'react-router-dom'
import { createAlbum, getTopAlbums } from '../albums'
import AlbumListItem from '../components/album-list-item'
import { LoaderData } from '../types/react-router-extra-types'

export const loader = (async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const albums = await getTopAlbums(q)
  return { albums, q }
}) satisfies LoaderFunction

export async function action() {
  const album = await createAlbum()
  return { album }
}

export default function Root() {
  const { albums, q } = useLoaderData() as LoaderData<typeof loader>

  useEffect(() => {
    // to fix when clicking back after a search, that the form field still has the value the user entered even though the list is no longer filtered.
    // @ts-ignore TODO fix
    document.getElementById('q').value = q
  }, [q])
  return (
    <Container
      maxWidth="xl"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Celebrate David Bowie!</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4} md={3}>
          <Paper sx={{ p: 2, my: 2 }}>
            {/* <Stack spacing={2}> */}
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
            {/* <Form method="post">
                <Button type="submit" variant="contained" color="primary">
                  New
                </Button>
              </Form>
            </Stack> */}
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
        <Grid item xs={12} sm={8} md={9} sx={{ my: 2 }}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  )
}
