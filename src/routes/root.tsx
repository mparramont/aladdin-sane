import {
  AppBar,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
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

const sortTypes = ['popularity', 'name', 'year']
type SortType = (typeof sortTypes)[number]

export default function Root() {
  const { albums, q } = useLoaderData() as LoaderData<typeof loader>
  const [sortOrder, setSortOrder] = useState<SortType>('popularity')

  useEffect(() => {
    // @ts-ignore TODO fix
    document.getElementById('q').value = q
  }, [q])

  const handleSortOrderChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSortOrder(event.target.value as string)
  }

  const getSortedAlbums = () => {
    if (sortOrder === 'popularity') return albums // default order, popularity
    return [...albums].sort((a, b) => {
      if (sortOrder === 'year') {
        if (a.year === null) return 1
        if (b.year === null) return -1
        return b.year - a.year
      }
      return a.name.localeCompare(b.name) // sort by name
    })
  }
  const sortedAlbums = getSortedAlbums()

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
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel htmlFor="sort-order">Sort by</InputLabel>
                <Select
                  id="sort-order"
                  value={sortOrder}
                  // @ts-ignore TODO fix, complicated one
                  onChange={handleSortOrderChange}
                >
                  {sortTypes.map((sortType) => (
                    <MenuItem key={sortType} value={sortType}>
                      {sortType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Form>
            <nav>
              {sortedAlbums.length ? (
                <List>
                  {sortedAlbums.map((album) => (
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
