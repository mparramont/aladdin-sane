import {
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import type { LoaderFunction } from 'react-router-dom'
import { Form, Link, Outlet, useLoaderData } from 'react-router-dom'
import { createAlbum, getAlbums } from '../albums'
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
    <Container
      maxWidth="xl"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Celebrate David Bowie!</Typography>
            <Stack spacing={2}>
              <form id="search-form" role="search">
                <TextField
                  id="q"
                  aria-label="Search albums"
                  placeholder="Search"
                  type="search"
                  name="q"
                  fullWidth
                />
                <div id="search-spinner" aria-hidden hidden>
                  <CircularProgress />
                </div>
                <div className="sr-only" aria-live="polite" />
              </form>
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
                    <ListItem
                      key={album.id}
                      component={Link}
                      to={`albums/${album.id}`}
                    >
                      <ListItemText
                        primary={album.name ? album.name : <i>No Name</i>}
                        secondary={album.favorite && '‚òÖ'}
                      />
                    </ListItem>
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
